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
