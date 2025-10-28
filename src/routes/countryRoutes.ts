import { Router } from 'express';

import {
  refreshCountriesController,
  getAllCountriesController,
  getCountryByNameController,
} from '../controllers/countryController';

const router = Router();

router.post('/countries/refresh', refreshCountriesController);

router.get('/countries', getAllCountriesController);

router.get('/countries/:name', getCountryByNameController);

export default router;
