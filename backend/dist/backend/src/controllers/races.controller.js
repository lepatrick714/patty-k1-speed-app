"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.racesController = exports.RacesController = void 0;
const data_service_1 = require("../services/data.service");
class RacesController {
    /**
     * GET /api/races - Get all races with optional filters
     */
    async getAllRaces(req, res, next) {
        try {
            const filters = {
                location: req.query.location,
                racerName: req.query.racerName,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
            };
            // Validate pagination
            if (filters.page < 1)
                filters.page = 1;
            if (filters.limit < 1 || filters.limit > 100)
                filters.limit = 20;
            // Parse dates
            const filterOptions = {
                location: filters.location,
                racerName: filters.racerName,
            };
            if (filters.startDate) {
                filterOptions.startDate = new Date(filters.startDate);
            }
            if (filters.endDate) {
                filterOptions.endDate = new Date(filters.endDate);
            }
            const allRaces = await data_service_1.dataService.getRaces(filterOptions);
            // Pagination
            const total = allRaces.length;
            const totalPages = Math.ceil(total / filters.limit);
            const start = (filters.page - 1) * filters.limit;
            const end = start + filters.limit;
            const paginatedRaces = allRaces.slice(start, end);
            const response = {
                success: true,
                data: paginatedRaces,
                pagination: {
                    page: filters.page,
                    limit: filters.limit,
                    total,
                    totalPages,
                },
            };
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/races/:id - Get single race by ID
     */
    async getRaceById(req, res, next) {
        try {
            const { id } = req.params;
            const race = await data_service_1.dataService.getRaceById(id);
            if (!race) {
                res.status(404).json({
                    success: false,
                    error: 'Race not found',
                });
                return;
            }
            res.json({
                success: true,
                data: race,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/races/locations - Get all unique locations
     */
    async getLocations(req, res, next) {
        try {
            const locations = await data_service_1.dataService.getLocations();
            res.json({
                success: true,
                data: locations,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/races/tracks - Get all unique track combinations (location + track)
     */
    async getTracks(req, res, next) {
        try {
            const races = await data_service_1.dataService.getAllRaces();
            const tracks = new Set();
            races.forEach(race => {
                const trackId = `${race.raceInfo.location} - ${race.raceInfo.track}`;
                tracks.add(trackId);
            });
            res.json({
                success: true,
                data: Array.from(tracks).sort(),
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/races/refresh - Force refresh race data
     */
    async refreshRaces(req, res, next) {
        try {
            data_service_1.dataService.clearCache();
            const races = await data_service_1.dataService.getAllRaces(true);
            res.json({
                success: true,
                message: `Refreshed ${races.length} races`,
                data: { count: races.length },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RacesController = RacesController;
exports.racesController = new RacesController();
