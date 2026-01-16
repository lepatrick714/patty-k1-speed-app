/**
 * Type definitions for K1 Speed race results
 */

export interface RaceResult {
  /** Race position (1st, 2nd, etc.) */
  position: number;
  /** Racer name */
  racer: string;
  /** Best lap time (e.g., "28.844") */
  bestTime: string;
  /** Lap number with best time */
  bestLap: number;
  /** Total laps completed */
  laps: number;
  /** Average lap time */
  avg: string;
  /** Gap to leader */
  gap: string;
  /** K1RS score with change (e.g., "1244 (+44)") */
  k1rs: string;
}

export interface RaceInfo {
  /** Track location (e.g., "K1 Speed Anaheim") */
  location: string;
  /** Track identifier (e.g., "T1") */
  track: string;
  /** Race date and time */
  date: Date;
  /** Original email subject */
  rawSubject: string;
}

export interface ParsedRaceEmail {
  /** Race metadata */
  raceInfo: RaceInfo;
  /** Array of race results */
  results: RaceResult[];
  /** Original email body */
  rawBody: string;
}

export interface FetchedEmail {
  /** Email subject */
  subject: string;
  /** Plain text body */
  text: string;
  /** HTML body */
  html: string;
  /** Email date */
  date: Date;
}

export interface FetchOptions {
  /** Maximum emails to fetch */
  limit?: number;
  /** Only fetch emails since this date */
  since?: Date;
}

export interface ParseOptions extends FetchOptions {
  /** Save results to JSON file */
  saveJson?: boolean;
  /** Show raw email body for debugging */
  debug?: boolean;
}

export interface RacerStats {
  /** Racer name */
  racer: string;
  /** Number of races */
  races: number;
  /** Best time ever */
  bestTime?: string;
  /** Average best time */
  avgBestTime?: string;
  /** Average finishing position */
  avgPosition?: string;
  /** Number of wins */
  wins?: number;
  /** Number of podium finishes */
  podiums?: number;
  /** Individual race results */
  results?: RacerRaceResult[];
}

export interface RacerRaceResult extends RaceResult {
  /** Race date */
  date: Date;
  /** Track location */
  location: string;
  /** Track identifier */
  track: string;
}
