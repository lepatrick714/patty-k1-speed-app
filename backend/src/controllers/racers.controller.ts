import { Request, Response, NextFunction } from 'express';
import { dataService } from '../services/data.service';
import { ApiResponse } from '../types/api.types';
import { RacerStats } from '../types/shared.types';

export class RacersController {
  /**
   * GET /api/racers - Get all racers
   */
  async getAllRacers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const racers = await dataService.getAllRacers();
      
      res.json({
        success: true,
        data: racers,
      } as ApiResponse<string[]>);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/racers/:name - Get racer statistics
   */
  async getRacerStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.params;
      const stats = await dataService.getRacerStats(decodeURIComponent(name));

      if (!stats) {
        res.status(404).json({
          success: false,
          error: 'Racer not found',
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: stats,
      } as ApiResponse<RacerStats>);
    } catch (error) {
      next(error);
    }
  }
}

export const racersController = new RacersController();
