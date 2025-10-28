import axios from 'axios';
import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

import { CountryApiResponse, ExchangeRateApiResponse } from '../utils/types';
import { AppError } from '../utils/errorHandler';
import { generateSummaryImage } from './imageService';

// --- API URLs ---
const COUNTRIES_API_URL =
  'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies';
const EXCHANGE_RATE_API_URL = 'https://open.er-api.com/v6/latest/USD';

export async function fetchExternalData() {
  try {
    // Use Promise.all to fetch from both APIs at the same time
    const [countriesResponse, exchangeRatesResponse] = await Promise.all([
      axios.get<CountryApiResponse[]>(COUNTRIES_API_URL),
      axios.get<ExchangeRateApiResponse>(EXCHANGE_RATE_API_URL),
    ]);

    return {
      countries: countriesResponse.data,
      rates: exchangeRatesResponse.data.rates,
    };
  } catch (error) {
    // If any of the API calls fail, throw a specific error
    if (axios.isAxiosError(error)) {
      const apiName = error.config?.url?.includes('restcountries')
        ? 'Countries API'
        : 'Exchange Rate API';
      throw new AppError(
        503,
        `External data source unavailable: Could not fetch data from ${apiName}`
      );
    }
    // For any other unexpected errors
    throw new AppError(
      500,
      'An unexpected error occurred while fetching external data.'
    );
  }
}

export async function refreshCountryData() {
  const { countries, rates } = await fetchExternalData();

  const lastRefreshedAt = new Date();

  // Process each country and prepare data for insertion
  for (const country of countries) {
    const currencyCode = country.currencies?.[0]?.code || null;
    let exchangeRate: number | null = null;

    let estimatedGdp: number | null = null;

    if (currencyCode) {
      // Case 1: Currency code exists. Try to find a rate.
      exchangeRate = rates[currencyCode] || null;
      if (exchangeRate && country.population > 0) {
        // Sub-case 1.1: Rate found. Calculate GDP.
        const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
        estimatedGdp = (country.population * randomMultiplier) / exchangeRate;
      }
      // If rate is not found, estimatedGdp remains null
    } else {
      // Case 2: No currency code. GDP must be 0.
      estimatedGdp = 0;
    }

    // Prisma's `upsert` handles the case-insensitive name match if your DB collation is case-insensitive (default for MySQL)
    await prisma.country.upsert({
      where: { name: country.name },
      update: {
        // Data for updating an existing record
        capital: country.capital,
        region: country.region,
        population: country.population,
        currency_code: currencyCode,
        exchange_rate: exchangeRate,
        estimated_gdp: estimatedGdp,
        flag_url: country.flag,
        last_refreshed_at: lastRefreshedAt,
      },
      create: {
        // Data for creating a new record
        name: country.name,
        capital: country.capital,
        region: country.region,
        population: country.population,
        currency_code: currencyCode,
        exchange_rate: exchangeRate,
        estimated_gdp: estimatedGdp,
        flag_url: country.flag,
        last_refreshed_at: lastRefreshedAt,
      },
    });
  }

  // Update global status
  const completionTimestamp = new Date();
  const totalCountries = await prisma.country.count();
  await prisma.apiStatus.upsert({
    where: { key: 'global' },
    update: {
      total_countries: totalCountries,
      last_refreshed_at: completionTimestamp,
    },
    create: {
      key: 'global',
      total_countries: totalCountries,
      last_refreshed_at: completionTimestamp,
    },
  });

  // --- Image Generation Step ---

  // 1. Fetch the data needed for the image here.
  const topCountriesForImage = await prisma.country.findMany({
    orderBy: { estimated_gdp: 'desc' },
    take: 5,
    where: { estimated_gdp: { not: null } },
  });

  // 2. Pass all required data to the image service.
  await generateSummaryImage(
    totalCountries,
    completionTimestamp,
    topCountriesForImage
  );

  return { totalCountries, lastRefreshedAt: completionTimestamp };
}

export async function getAllCountries(query: {
  region?: string;
  currency?: string;
  sort?: string;
}) {
  const where: Prisma.CountryWhereInput = {};

  // Apply filters if they exist
  if (query.region) {
    where.region = { equals: query.region };
  }
  if (query.currency) {
    where.currency_code = { equals: query.currency };
  }

  // Apply sorting if it exists
  const orderBy: Prisma.CountryOrderByWithRelationInput = {};
  if (query.sort === 'gdp_desc') {
    orderBy.estimated_gdp = 'desc';
  } else if (query.sort === 'gdp_asc') {
    orderBy.estimated_gdp = 'asc';
  }

  const countries = await prisma.country.findMany({
    where,
    orderBy,
  });

  // IMPORTANT: Convert data to be JSON-safe before returning
  return countries.map(country => ({
    ...country,
    // Convert Float types from Prisma back to standard numbers for the response
    exchange_rate: country.exchange_rate,
    estimated_gdp: country.estimated_gdp,
  }));
}
