# K1 Speed Race Results Parser

A Node.js application to fetch and parse K1 Speed race result emails using Google OAuth2.

## Features

- 🔐 Secure OAuth2 authentication (no password storage!)
- 📧 Fetches race result emails via Gmail IMAP
- 📊 Parses race tables to extract positions, times, laps, and K1RS scores
- 📈 Tracks racer statistics across multiple races
- 💾 Optionally saves results to JSON

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Gmail API**:
   - Go to "APIs & Services" → "Enable APIs and Services"
   - Search for "Gmail API" and enable it
4. Configure OAuth consent screen:
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" (or "Internal" for Workspace)
   - Fill in app name, support email
   - Add scope: `https://mail.google.com/`
   - Add your email as a test user
5. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Desktop app** (recommended) or Web application
   - If Web app: Add `http://localhost:3000/oauth2callback` as authorized redirect URI
6. Download or copy the Client ID and Client Secret

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your OAuth credentials:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
```

### 4. Authenticate

Run the authentication command - it will open your browser:

```bash
npm run auth
```

This will:
1. Open a browser window for Google sign-in
2. Ask for permission to access your Gmail
3. Save a refresh token locally (`.gmail-token.json`)

You only need to do this once! The token will auto-refresh.

## Usage

### Fetch and Parse All Emails

```bash
npm start
```

With options:

```bash
# Limit to 10 most recent emails
npm start -- --limit=10

# Save results to JSON file
npm start -- --save

# Both
npm start -- --limit=20 --save
```

### Test the Parser

Run the parser with sample data (no email fetch):

```bash
npm run parse
```

### Run Tests

```bash
npm test
```

## Output Format

The parser extracts the following data from each race:

### Race Info
- Location (e.g., "K1 Speed Anaheim")
- Track (e.g., "T1")
- Date and time

### Results Table
| Field | Description |
|-------|-------------|
| position | Race finishing position |
| racer | Racer name |
| bestTime | Best lap time in seconds |
| bestLap | Lap number with best time |
| laps | Total laps completed |
| avg | Average lap time |
| gap | Time gap to race leader |
| k1rs | K1RS rating with change |

## Example Output

```
============================================================
Race: K1 Speed Anaheim - T1
Date: 12/29/2025, 7:17:00 PM
============================================================

Pos  Racer                Best     Lap  Total  Avg      Gap      K1RS
---------------------------------------------------------------------------
1    Kevin Ruiz           28.844   8    11     36.975   0.000    1244 (+44)
2    Lam Le               28.857   9    12     34.283   0.013    1584 (+40)
3    Irl Strachan         29.022   5    11     39.160   0.178    1356 (+32)
```

## API

### `parseRaceEmail(subject, body)`

Parse an email subject and body into structured race data.

```javascript
import { parseRaceEmail } from './src/parseResults.js';

const parsed = parseRaceEmail(subject, body);
// Returns: { raceInfo, results, rawBody }
```

### `fetchAndParseRaces(options)`

Fetch emails and parse all K1 Speed race results.

```javascript
import { fetchAndParseRaces } from './src/index.js';

const races = await fetchAndParseRaces({ limit: 50, saveJson: true });
```

### `getRacerStats(races, racerName)`

Get statistics for a specific racer across all races.

```javascript
import { getRacerStats } from './src/index.js';

const stats = getRacerStats(races, 'Kevin Ruiz');
// Returns: { races, bestTime, avgBestTime, avgPosition, wins, podiums, results }
```

## License

MIT
