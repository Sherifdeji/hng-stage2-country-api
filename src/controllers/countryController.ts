import * as countryService from '../services/countryService';
import { Request, Response } from 'express';

export const refreshCountriesController = async (
  req: Request,
  res: Response
) => {
  const { totalCountries, lastRefreshedAt } =
    await countryService.refreshCountryData();

  res.status(200).json({
    message: 'Countries data refreshed successfully',
    total_countries: totalCountries,
    last_refreshed_at: lastRefreshedAt.toISOString(),
  });
};

export const getAllCountriesController = async (
  req: Request,
  res: Response
) => {
  const countries = await countryService.getAllCountries(req.query);
  res.status(200).json(countries);
};

export const getCountryByNameController = async (
  req: Request,
  res: Response
) => {
  const { name } = req.params;
  const country = await countryService.getCountryByName(name);
  res.status(200).json(country);
};
