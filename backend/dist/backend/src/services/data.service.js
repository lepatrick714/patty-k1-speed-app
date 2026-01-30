"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataService = exports.DataService = void 0;
// Import the parser functions - we'll use dynamic import since they're ES modules
let fetchAndParseRaces;
let getRacerStats;
// Lazy load the ES module functions
async function loadParserFunctions() {
    if (!fetchAndParseRaces) {
        const parserModule = await Promise.resolve().then(() => __importStar(require('../../../src/index.js')));
        fetchAndParseRaces = parserModule.fetchAndParseRaces;
        getRacerStats = parserModule.getRacerStats;
    }
}
class DataService {
    cachedRaces = null;
    lastFetchTime = null;
    CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
    /**
     * Fetch all races (with caching)
     */
    async getAllRaces(forceRefresh = false) {
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
    async getRaces(filters) {
        let races = await this.getAllRaces();
        if (filters.location) {
            races = races.filter(r => r.raceInfo.location.toLowerCase().includes(filters.location.toLowerCase()));
        }
        if (filters.racerName) {
            races = races.filter(r => r.results.some(result => result.racer.toLowerCase().includes(filters.racerName.toLowerCase())));
        }
        if (filters.startDate) {
            races = races.filter(r => r.raceInfo.date >= filters.startDate);
        }
        if (filters.endDate) {
            races = races.filter(r => r.raceInfo.date <= filters.endDate);
        }
        return races;
    }
    /**
     * Get single race by index or date
     */
    async getRaceById(id) {
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
    async getLocations() {
        const races = await this.getAllRaces();
        const locations = new Set(races.map(r => r.raceInfo.location));
        return Array.from(locations).sort();
    }
    /**
     * Get all unique racers
     */
    async getAllRacers() {
        const races = await this.getAllRaces();
        const racers = new Set();
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
    async getRacerStats(racerName) {
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
    clearCache() {
        this.cachedRaces = null;
        this.lastFetchTime = null;
    }
}
exports.DataService = DataService;
exports.dataService = new DataService();
