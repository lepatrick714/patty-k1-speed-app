/**
 * Shared type definitions
 * Copied from src/types.ts to avoid cross-package imports
 */

export interface RaceResult {
  position: number;
  racer: string;
  bestTime: string;
  bestLap: number;
  laps: number;
  avg: string;
  gap: string;
  k1rs: string;
}

export interface RaceInfo {
  location: string;
  track: string;
  date: Date;
  rawSubject: string;
}

export interface ParsedRaceEmail {
  raceInfo: RaceInfo;
  results: RaceResult[];
  rawBody: string;
}

export interface RacerStats {
  racer: string;
  races: number;
  bestTime?: string;
  avgBestTime?: string;
  avgPosition?: string;
  wins?: number;
  podiums?: number;
  results?: RacerRaceResult[];
}

export interface RacerRaceResult extends RaceResult {
  date: Date;
  location: string;
  track: string;
}

export interface ParseOptions {
  limit?: number;
  since?: Date;
  saveJson?: boolean;
  debug?: boolean;
}
