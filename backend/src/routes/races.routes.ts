import { Router } from 'express';
import { racesController } from '../controllers/races.controller';

const router = Router();

router.get('/', (req, res, next) => racesController.getAllRaces(req, res, next));
router.get('/locations', (req, res, next) => racesController.getLocations(req, res, next));
router.get('/tracks', (req, res, next) => racesController.getTracks(req, res, next));
router.post('/refresh', (req, res, next) => racesController.refreshRaces(req, res, next));
router.get('/:id', (req, res, next) => racesController.getRaceById(req, res, next));

export default router;
