import { Router } from 'express';

import { refreshCountriesController } from '../controllers/countryController';

const router = Router();

router.post('/countries/refresh', refreshCountriesController);

export default router;
