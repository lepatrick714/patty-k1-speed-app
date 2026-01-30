/**
 * K1 Speed Race Results Parser
 * Parses race result tables from K1 Speed emails
 */
import type { RaceInfo, RaceResult, ParsedRaceEmail } from './types.js';
/**
 * Parse the email subject to extract race info
 * Format: "Your Race Results at K1 Speed Anaheim T1 12/29/25 07:17 PM"
 */
export declare function parseSubject(subject: string): RaceInfo | null;
/**
 * Parse a single result row from the race table
 * Format: "#\tRacer\tBest Time\tBest Lap\tLaps\tAvg.\tGap\tK1RS"
 */
export declare function parseResultRow(line: string): RaceResult | null;
/**
 * Parse the full race results table from email body
 */
export declare function parseResultsTable(body: string): RaceResult[];
/**
 * Extract text content from HTML, preserving table structure
 */
export declare function extractTextFromHtml(html: string): string;
/**
 * Parse results from HTML table format used by K1 Speed emails
 */
export declare function parseResultsFromHtml(content: string): RaceResult[];
/**
 * Parse a complete K1 Speed race email
 */
export declare function parseRaceEmail(subject: string, textBody?: string, htmlBody?: string): ParsedRaceEmail | null;
/**
 * Format race results as a readable string
 */
export declare function formatResults(parsed: ParsedRaceEmail): string;
//# sourceMappingURL=parseResults.d.ts.map