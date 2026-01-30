import type { ParsedRaceEmail, RacerStats } from '../types/shared.types';

// Import the parser functions - we'll use dynamic import since they're ES modules
let fetchAndParseRaces: any;
let getRacerStats: any;

// Lazy load the ES module functions
async function loadParserFunctions() {
  if (!fetchAndParseRaces) {
    const parserModule = await import('../../../src/index.js');
    fetchAndParseRaces = parserModule.fetchAndParseRaces;
    getRacerStats = parserModule.getRacerStats;
  }
}

export class DataService {
  private cachedRaces: ParsedRaceEmail[] | null = null;
  private lastFetchTime: Date | null = null;
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch all races (with caching)
   */
  async getAllRaces(forceRefresh = false): Promise<ParsedRaceEmail[]> {
    await loadParserFunctions();
    
    const now = new Date();
    const cacheExpired = !this.lastFetchTime || 
      (now.getTime() - this.lastFetchTime.getTime()) > this.CACHE_DURATION_MS;

    if (forceRefresh || !this.cachedRaces || cacheExpired) {
      console.log('Fetching races from email...');
      this.cachedRaces = await fetchAndParseRaces({ limit: 50 });
      this.lastFetchTime = now;
    }

    return this.cachedRaces || [];
  }

  /**
   * Get races filtered by criteria
   */
  async getRaces(filters: {
    location?: string;
    racerName?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<ParsedRaceEmail[]> {
    let races = await this.getAllRaces();

    if (filters.location) {
      races = races.filter(r => 
        r.raceInfo.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.racerName) {
      races = races.filter(r =>
        r.results.some(result => 
          result.racer.toLowerCase().includes(filters.racerName!.toLowerCase())
        )
      );
    }

    if (filters.startDate) {
      races = races.filter(r => r.raceInfo.date >= filters.startDate!);
    }

    if (filters.endDate) {
      races = races.filter(r => r.raceInfo.date <= filters.endDate!);
    }

    return races;
  }

  /**
   * Get single race by index or date
   */
  async getRaceById(id: string): Promise<ParsedRaceEmail | null> {
    const races = await this.getAllRaces();
    const index = parseInt(id, 10);
    
    if (!isNaN(index) && index >= 0 && index < races.length) {
      return races[index];
    }

    return null;
  }

  /**
   * Get unique locations
   */
  async getLocations(): Promise<string[]> {
    const races = await this.getAllRaces();
    const locations = new Set(races.map(r => r.raceInfo.location));
    return Array.from(locations).sort();
  }

  /**
   * Get all unique racers
   */
  async getAllRacers(): Promise<string[]> {
    const races = await this.getAllRaces();
    const racers = new Set<string>();
    
    races.forEach(race => {
      race.results.forEach(result => {
        racers.add(result.racer);
      });
    });

    return Array.from(racers).sort();
  }

  /**
   * Get stats for a specific racer
   */
  async getRacerStats(racerName: string): Promise<RacerStats | null> {
    await loadParserFunctions();
    const races = await this.getAllRaces();
    const stats = getRacerStats(races, racerName);
    
    if (stats.races === 0) {
      return null;
    }

    return stats;
  }

  /**
   * Clear cache (for manual refresh)
   */
  clearCache(): void {
    this.cachedRaces = null;
    this.lastFetchTime = null;
  }
}

export const dataService = new DataService();
