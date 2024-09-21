import { Router } from 'express';
import { getSearchFlight } from '../controllers/seachController.js';

const router = Router();

router.get('/', getSearchFlight);

export { router as serachRouter };
