import { Request, Response, NextFunction } from 'express';
import { dataService } from '../services/data.service';
import { ApiResponse, PaginatedResponse, RaceFilters } from '../types/api.types';
import { ParsedRaceEmail } from '../types/shared.types';

export class RacesController {
  /**
   * GET /api/races - Get all races with optional filters
   */
  async getAllRaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: RaceFilters = {
        location: req.query.location as string,
        racerName: req.query.racerName as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      };

      // Validate pagination
      if (filters.page! < 1) filters.page = 1;
      if (filters.limit! < 1 || filters.limit! > 100) filters.limit = 20;

      // Parse dates
      const filterOptions: any = {
        location: filters.location,
        racerName: filters.racerName,
      };

      if (filters.startDate) {
        filterOptions.startDate = new Date(filters.startDate);
      }
      if (filters.endDate) {
        filterOptions.endDate = new Date(filters.endDate);
      }

      const allRaces = await dataService.getRaces(filterOptions);
      
      // Pagination
      const total = allRaces.length;
      const totalPages = Math.ceil(total / filters.limit!);
      const start = (filters.page! - 1) * filters.limit!;
      const end = start + filters.limit!;
      const paginatedRaces = allRaces.slice(start, end);

      const response: PaginatedResponse<ParsedRaceEmail[]> = {
        success: true,
        data: paginatedRaces,
        pagination: {
          page: filters.page!,
          limit: filters.limit!,
          total,
          totalPages,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/races/:id - Get single race by ID
   */
  async getRaceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const race = await dataService.getRaceById(id);

      if (!race) {
        res.status(404).json({
          success: false,
          error: 'Race not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: race,
      } as ApiResponse<ParsedRaceEmail>);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/races/locations - Get all unique locations
   */
  async getLocations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locations = await dataService.getLocations();
      res.json({
        success: true,
        data: locations,
      } as ApiResponse<string[]>);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/races/refresh - Force refresh race data
   */
  async refreshRaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      dataService.clearCache();
      const races = await dataService.getAllRaces(true);
      
      res.json({
        success: true,
        message: `Refreshed ${races.length} races`,
        data: { count: races.length },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export const racesController = new RacesController();
