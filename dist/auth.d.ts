/**
 * Google OAuth2 Authentication for Gmail
 * Handles OAuth flow and token management
 */
import { Auth } from 'googleapis';
interface TokenData {
    access_token?: string | null;
    refresh_token?: string | null;
    expiry_date?: number | null;
    token_type?: string | null;
    scope?: string;
}
/**
 * Create OAuth2 client from environment variables
 */
export declare function createOAuth2Client(): Auth.OAuth2Client;
/**
 * Load saved tokens from disk
 */
export declare function loadSavedToken(): TokenData | null;
/**
 * Save tokens to disk
 */
export declare function saveToken(tokens: TokenData): void;
/**
 * Get authenticated OAuth2 client
 * Will use saved token if available, otherwise prompts for auth
 */
export declare function getAuthenticatedClient(forceNew?: boolean): Promise<Auth.OAuth2Client>;
/**
 * Get access token for IMAP XOAUTH2
 */
export declare function getAccessToken(): Promise<string>;
/**
 * Get user's email address from token info
 */
export declare function getUserEmail(): Promise<string>;
export {};
//# sourceMappingURL=auth.d.ts.map