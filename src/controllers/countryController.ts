import * as countryService from '../services/countryService';
import { Request, Response } from 'express';
import { AppError } from '../utils/errorHandler';
import { CACHE_DIR } from '../config/path';

import fs from 'fs';
import path from 'path';

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

export const deleteCountryByNameController = async (
  req: Request,
  res: Response
) => {
  const { name } = req.params;
  await countryService.deleteCountryByName(name);
  res.status(204).send();
};

export const getStatusController = async (req: Request, res: Response) => {
  const status = await countryService.getApiStatus();
  res.status(200).json(status);
};

export const getSummaryImageController = (req: Request, res: Response) => {
  const imagePath = path.join(CACHE_DIR, 'summary.png');

  // Check if the file exists
  if (!fs.existsSync(imagePath)) {
    throw new AppError(404, 'Summary image not found');
  }

  // Send the file as the response
  res.sendFile(imagePath);
};
