/**
 * K1 Speed Email Fetcher
 * Fetches K1 Speed race result emails via IMAP with OAuth2
 */
import type { FetchedEmail, FetchOptions } from './types.js';
/**
 * Search for K1 Speed race result emails
 */
export declare function fetchK1SpeedEmails(options?: FetchOptions): Promise<FetchedEmail[]>;
/**
 * Fetch emails and return as array (main entry point)
 */
export declare function getEmails(options?: FetchOptions): Promise<FetchedEmail[]>;
//# sourceMappingURL=fetchEmails.d.ts.map