/**
 * Google OAuth2 Authentication for Gmail
 * Handles OAuth flow and token management
 */

import { google, Auth } from 'googleapis';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import open from 'open';
import { config } from 'dotenv';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Token storage path
const TOKEN_PATH = join(__dirname, '..', '.gmail-token.json');

// Gmail IMAP scope + email scope for getting user info
const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/userinfo.email',
];

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
export function createOAuth2Client(): Auth.OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback';

  if (!clientId || !clientSecret) {
    throw new Error(
      'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env file.\n' +
      'Create credentials at: https://console.cloud.google.com/apis/credentials'
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Load saved tokens from disk
 */
export function loadSavedToken(): TokenData | null {
  try {
    if (existsSync(TOKEN_PATH)) {
      const content = readFileSync(TOKEN_PATH, 'utf-8');
      return JSON.parse(content) as TokenData;
    }
  } catch (err) {
    const error = err as Error;
    console.error('Error loading saved token:', error.message);
  }
  return null;
}

/**
 * Save tokens to disk
 */
export function saveToken(tokens: TokenData): void {
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('Token saved to', TOKEN_PATH);
}

/**
 * Get authenticated OAuth2 client
 * Will use saved token if available, otherwise prompts for auth
 */
export async function getAuthenticatedClient(forceNew = false): Promise<Auth.OAuth2Client> {
  const oauth2Client = createOAuth2Client();
  
  // Try to load existing token
  if (!forceNew) {
    const savedToken = loadSavedToken();
    if (savedToken) {
      oauth2Client.setCredentials(savedToken);
      
      // Check if token is expired and refresh if needed
      if (savedToken.expiry_date && savedToken.expiry_date < Date.now()) {
        console.log('Token expired, refreshing...');
        try {
          const { credentials } = await oauth2Client.refreshAccessToken();
          saveToken(credentials);
          oauth2Client.setCredentials(credentials);
        } catch (err) {
          console.log('Failed to refresh token, need to re-authenticate');
          return authenticateWithBrowser(oauth2Client);
        }
      }
      
      return oauth2Client;
    }
  }

  return authenticateWithBrowser(oauth2Client);
}

/**
 * Authenticate using browser-based OAuth flow
 */
async function authenticateWithBrowser(oauth2Client: Auth.OAuth2Client): Promise<Auth.OAuth2Client> {
  return new Promise((resolve, reject) => {
    // Generate auth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent', // Always prompt to ensure we get refresh token
    });

    console.log('\n🔐 Opening browser for Google authentication...\n');

    // Create local server to receive callback
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const url = new URL(req.url || '', 'http://localhost:3000');
        
        if (url.pathname === '/oauth2callback') {
          const code = url.searchParams.get('code');
          const error = url.searchParams.get('error');

          if (error) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end(`<h1>Authentication Failed</h1><p>${error}</p>`);
            server.close();
            reject(new Error(`OAuth error: ${error}`));
            return;
          }

          if (code) {
            // Exchange code for tokens
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            saveToken(tokens);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                  <h1>✅ Authentication Successful!</h1>
                  <p>You can close this window and return to the terminal.</p>
                </body>
              </html>
            `);

            server.close();
            resolve(oauth2Client);
          }
        }
      } catch (err) {
        const error = err as Error;
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>Error</h1><p>${error.message}</p>`);
        server.close();
        reject(err);
      }
    });

    server.listen(3000, () => {
      console.log('Waiting for authentication callback on http://localhost:3000...');
      console.log(`\nIf browser doesn't open automatically, visit:\n${authUrl}\n`);
      open(authUrl);
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Authentication timed out'));
    }, 5 * 60 * 1000);
  });
}

/**
 * Get access token for IMAP XOAUTH2
 */
export async function getAccessToken(): Promise<string> {
  const client = await getAuthenticatedClient();
  const { token } = await client.getAccessToken();
  
  if (!token) {
    throw new Error('Failed to get access token');
  }
  
  return token;
}

/**
 * Get user's email address from token info
 */
export async function getUserEmail(): Promise<string> {
  const client = await getAuthenticatedClient();
  const oauth2 = google.oauth2({ version: 'v2', auth: client });
  const { data } = await oauth2.userinfo.get();
  return data.email || '';
}

// Run directly to authenticate
const isMainModule = process.argv[1]?.includes('auth');
if (isMainModule) {
  const forceNew = process.argv.includes('--force');
  
  console.log('K1 Speed App - Google OAuth2 Setup\n');
  
  getAuthenticatedClient(forceNew)
    .then(async () => {
      const email = await getUserEmail();
      console.log(`\n✅ Successfully authenticated as: ${email}`);
      console.log('\nYou can now run: npm start');
      process.exit(0);
    })
    .catch((err: Error) => {
      console.error('\n❌ Authentication failed:', err.message);
      process.exit(1);
    });
}
