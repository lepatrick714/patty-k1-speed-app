"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.racersController = exports.RacersController = void 0;
const data_service_1 = require("../services/data.service");
class RacersController {
    /**
     * GET /api/racers - Get all racers
     */
    async getAllRacers(req, res, next) {
        try {
            const racers = await data_service_1.dataService.getAllRacers();
            res.json({
                success: true,
                data: racers,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/racers/:name - Get racer statistics
     */
    async getRacerStats(req, res, next) {
        try {
            const { name } = req.params;
            const stats = await data_service_1.dataService.getRacerStats(decodeURIComponent(name));
            if (!stats) {
                res.status(404).json({
                    success: false,
                    error: 'Racer not found',
                });
                return;
            }
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RacersController = RacersController;
exports.racersController = new RacersController();
