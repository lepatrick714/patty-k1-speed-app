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
Race: K1 Speed Tukwila - T1
Date: 1/13/2026, 9:01:00 PM
============================================================

Pos  Racer                Best     Lap  Total  Avg      Gap      K1RS
---------------------------------------------------------------------------
1    Juan Munoz           35.241   5    12     42.831   0.000    1264 (+30)
2    Serge Lobatch        35.286   9    12     46.654   0.045    1262 (+24)
3    Lam Le               36.289   9    12     46.782   1.048    1244 (+22)
4    Alvaro Pinto         36.798   9    12     47.535   1.557    1230 (+20)
5    Andres Marulanda     37.025   4    12     46.671   1.784    1240 (+18)
6    Jacob Balikov        37.507   11   11     51.439   2.266    1230 (+16)
7    Diego Marulanda      37.719   11   12     47.762   2.478    1240 (+14)
8    Leonardo Marulanda   37.824   11   12     47.220   2.583    1222 (+12)
9    Aaryan Gautam        38.326   10   11     49.541   3.085    1218 (+10)
10   Amal deepak Thiru    39.101   10   10     51.054   3.860    1212 (+8)
11   Roman Black          39.705   10   10     53.145   4.464    1218 (+6)
12   Merdi Kabasele       42.972   10   10     56.369   7.731    1210 (+4)
13   Magda Lusa           45.601   9    9      56.466   10.360   1204 (+2)
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
