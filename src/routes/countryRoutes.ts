import { Router } from 'express';

import {
  refreshCountriesController,
  getAllCountriesController,
} from '../controllers/countryController';

const router = Router();

router.post('/countries/refresh', refreshCountriesController);

router.get('/countries', getAllCountriesController);

export default router;
