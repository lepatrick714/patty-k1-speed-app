"use strict";
/**
 * Google OAuth2 Authentication for Gmail
 * Handles OAuth flow and token management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOAuth2Client = createOAuth2Client;
exports.loadSavedToken = loadSavedToken;
exports.saveToken = saveToken;
exports.getAuthenticatedClient = getAuthenticatedClient;
exports.getAccessToken = getAccessToken;
exports.getUserEmail = getUserEmail;
const googleapis_1 = require("googleapis");
const http_1 = require("http");
const url_1 = require("url");
const fs_1 = require("fs");
const path_1 = require("path");
const url_2 = require("url");
const open_1 = __importDefault(require("open"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const __filename = (0, url_2.fileURLToPath)(import.meta.url);
const __dirname = (0, path_1.dirname)(__filename);
// Token storage path
const TOKEN_PATH = (0, path_1.join)(__dirname, '..', '.gmail-token.json');
// Gmail IMAP scope + email scope for getting user info
const SCOPES = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/userinfo.email',
];
/**
 * Create OAuth2 client from environment variables
 */
function createOAuth2Client() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback';
    if (!clientId || !clientSecret) {
        throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env file.\n' +
            'Create credentials at: https://console.cloud.google.com/apis/credentials');
    }
    return new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
}
/**
 * Load saved tokens from disk
 */
function loadSavedToken() {
    try {
        if ((0, fs_1.existsSync)(TOKEN_PATH)) {
            const content = (0, fs_1.readFileSync)(TOKEN_PATH, 'utf-8');
            return JSON.parse(content);
        }
    }
    catch (err) {
        const error = err;
        console.error('Error loading saved token:', error.message);
    }
    return null;
}
/**
 * Save tokens to disk
 */
function saveToken(tokens) {
    (0, fs_1.writeFileSync)(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log('Token saved to', TOKEN_PATH);
}
/**
 * Get authenticated OAuth2 client
 * Will use saved token if available, otherwise prompts for auth
 */
async function getAuthenticatedClient(forceNew = false) {
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
                }
                catch (err) {
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
async function authenticateWithBrowser(oauth2Client) {
    return new Promise((resolve, reject) => {
        // Generate auth URL
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent', // Always prompt to ensure we get refresh token
        });
        console.log('\n🔐 Opening browser for Google authentication...\n');
        // Create local server to receive callback
        const server = (0, http_1.createServer)(async (req, res) => {
            try {
                const url = new url_1.URL(req.url || '', 'http://localhost:3000');
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
            }
            catch (err) {
                const error = err;
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h1>Error</h1><p>${error.message}</p>`);
                server.close();
                reject(err);
            }
        });
        server.listen(3000, () => {
            console.log('Waiting for authentication callback on http://localhost:3000...');
            console.log(`\nIf browser doesn't open automatically, visit:\n${authUrl}\n`);
            (0, open_1.default)(authUrl);
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
async function getAccessToken() {
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
async function getUserEmail() {
    const client = await getAuthenticatedClient();
    const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth: client });
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
        .catch((err) => {
        console.error('\n❌ Authentication failed:', err.message);
        process.exit(1);
    });
}
