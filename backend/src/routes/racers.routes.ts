import { Router } from 'express';
import { racersController } from '../controllers/racers.controller';

const router = Router();

router.get('/', (req, res, next) => racersController.getAllRacers(req, res, next));
router.get('/:name', (req, res, next) => racersController.getRacerStats(req, res, next));

export default router;
