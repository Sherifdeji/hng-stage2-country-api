import { Router } from 'express';

import {
  refreshCountriesController,
  getAllCountriesController,
  getCountryByNameController,
  deleteCountryByNameController,
  getStatusController,
  getSummaryImageController,
} from '../controllers/countryController';

const router = Router();

router.post('/countries/refresh', refreshCountriesController);

router.get('/countries', getAllCountriesController);

router.get('/countries/image', getSummaryImageController);

router.get('/countries/:name', getCountryByNameController);

router.delete('/countries/:name', deleteCountryByNameController);

router.get('/status', getStatusController);

export default router;
