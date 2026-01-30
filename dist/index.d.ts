/**
 * K1 Speed Race Results App
 * Main entry point - fetches emails and parses race results
 */
import type { ParsedRaceEmail, ParseOptions, RacerStats } from './types.js';
/**
 * Fetch and parse all K1 Speed race emails
 */
export declare function fetchAndParseRaces(options?: ParseOptions): Promise<ParsedRaceEmail[]>;
/**
 * Get race statistics for a specific racer
 */
export declare function getRacerStats(races: ParsedRaceEmail[], racerName: string): RacerStats;
//# sourceMappingURL=index.d.ts.map