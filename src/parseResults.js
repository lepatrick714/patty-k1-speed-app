/**
 * K1 Speed Race Results Parser
 * Parses race result tables from K1 Speed emails
 */

/**
 * Parse the email subject to extract race info
 * Format: "Your Race Results at K1 Speed Anaheim T1 12/29/25 07:17 PM"
 * @param {string} subject - Email subject line
 * @returns {import('./types.js').RaceInfo | null}
 */
export function parseSubject(subject) {
  // Pattern: "Your Race Results at K1 Speed <Location> <Track> <Date> <Time>"
  const pattern = /Your Race Results at K1 Speed\s+(.+?)\s+(T\d+)\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(\d{1,2}:\d{2}\s*[AP]M)/i;
  const match = subject.match(pattern);

  if (!match) {
    return null;
  }

  const [, location, track, dateStr, timeStr] = match;

  // Parse the date - handle 2-digit year
  const [month, day, year] = dateStr.split('/').map(Number);
  const fullYear = year < 100 ? 2000 + year : year;

  // Parse time
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
  if (!timeMatch) return null;

  let [, hours, minutes, ampm] = timeMatch;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (ampm.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  const date = new Date(fullYear, month - 1, day, hours, minutes);

  return {
    location: `K1 Speed ${location.trim()}`,
    track: track.toUpperCase(),
    date,
    rawSubject: subject,
  };
}

/**
 * Parse a single result row from the race table
 * Format: "#\tRacer\tBest Time\tBest Lap\tLaps\tAvg.\tGap\tK1RS"
 * @param {string} line - A single line from the results table
 * @returns {import('./types.js').RaceResult | null}
 */
export function parseResultRow(line) {
  // Split by tabs or multiple spaces
  const parts = line.split(/\t+|\s{2,}/).map(p => p.trim()).filter(Boolean);

  if (parts.length < 8) {
    return null;
  }

  const position = parseInt(parts[0], 10);
  if (isNaN(position)) {
    return null;
  }

  return {
    position,
    racer: parts[1],
    bestTime: parts[2],
    bestLap: parseInt(parts[3], 10),
    laps: parseInt(parts[4], 10),
    avg: parts[5],
    gap: parts[6],
    k1rs: parts[7],
  };
}

/**
 * Parse the full race results table from email body
 * @param {string} body - Email body text
 * @returns {import('./types.js').RaceResult[]}
 */
export function parseResultsTable(body) {
  const results = [];
  const lines = body.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and header row
    if (!trimmed || trimmed.startsWith('#\t') || trimmed.startsWith('# ') || trimmed.startsWith('#	')) {
      continue;
    }

    // Try to parse if line starts with a number (position)
    if (/^\d+[\s\t]/.test(trimmed)) {
      const result = parseResultRow(trimmed);
      if (result) {
        results.push(result);
      }
    }
  }

  return results;
}

/**
 * Extract text content from HTML, preserving table structure
 * @param {string} html - HTML content
 * @returns {string} Extracted text
 */
export function extractTextFromHtml(html) {
  if (!html) return '';

  // Remove style and script tags and their content
  let text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Convert table cells to tab-separated values
  text = text.replace(/<\/th>\s*<th[^>]*>/gi, '\t');
  text = text.replace(/<\/td>\s*<td[^>]*>/gi, '\t');
  
  // Convert table rows to newlines
  text = text.replace(/<\/tr>/gi, '\n');
  text = text.replace(/<tr[^>]*>/gi, '');
  
  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num));
  
  // Clean up whitespace
  text = text.replace(/[ \t]+/g, '\t');
  text = text.replace(/\n\s*\n/g, '\n');
  
  return text.trim();
}

/**
 * Parse a complete K1 Speed race email
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {import('./types.js').ParsedRaceEmail | null}
 */
export function parseRaceEmail(subject, body) {
  const raceInfo = parseSubject(subject);

  if (!raceInfo) {
    return null;
  }

  const results = parseResultsTable(body);

  return {
    raceInfo,
    results,
    rawBody: body,
  };
}

/**
 * Format race results as a readable string
 * @param {import('./types.js').ParsedRaceEmail} parsed - Parsed race email
 * @returns {string}
 */
export function formatResults(parsed) {
  const { raceInfo, results } = parsed;

  let output = `\n${'='.repeat(60)}\n`;
  output += `Race: ${raceInfo.location} - ${raceInfo.track}\n`;
  output += `Date: ${raceInfo.date.toLocaleString()}\n`;
  output += `${'='.repeat(60)}\n\n`;

  output += `${'Pos'.padEnd(4)} ${'Racer'.padEnd(20)} ${'Best'.padEnd(8)} ${'Lap'.padEnd(4)} ${'Total'.padEnd(6)} ${'Avg'.padEnd(8)} ${'Gap'.padEnd(8)} K1RS\n`;
  output += `${'-'.repeat(75)}\n`;

  for (const r of results) {
    output += `${String(r.position).padEnd(4)} `;
    output += `${r.racer.padEnd(20)} `;
    output += `${r.bestTime.padEnd(8)} `;
    output += `${String(r.bestLap).padEnd(4)} `;
    output += `${String(r.laps).padEnd(6)} `;
    output += `${r.avg.padEnd(8)} `;
    output += `${r.gap.padEnd(8)} `;
    output += `${r.k1rs}\n`;
  }

  return output;
}

// Allow running directly for testing
if (process.argv[1] && process.argv[1].includes('parseResults')) {
  // Example test
  const testSubject = 'Your Race Results at K1 Speed Anaheim T1 12/29/25 07:17 PM';
  const testBody = `
#	Racer	Best Time	Best Lap	Laps	Avg.	Gap	K1RS
1	Kevin Ruiz	28.844	8	11	36.975	0.000	1244 (+44)
2	Lam Le	28.857	9	12	34.283	0.013	1584 (+40)
3	Irl Strachan	29.022	5	11	39.160	0.178	1356 (+32)
4	Sakal Strachan	29.149	5	11	37.985	0.305	1376 (+28)
5	Darren Van	29.232	10	12	34.668	0.388	1360 (+24)
6	Ignacio Ruiz	29.545	9	11	38.050	0.701	1220 (+20)
7	Kai Sivadasan	29.548	9	11	37.958	0.704	1326 (+16)
8	Harrison Le	29.714	10	12	34.759	0.870	1292 (+12)
9	Adalia Almanza	32.039	9	9	44.033	3.195	1208 (+8)
10	Giovanni Almanza	33.292	8	10	43.115	4.448	1204 (+4)
`;

  const parsed = parseRaceEmail(testSubject, testBody);
  if (parsed) {
    console.log(formatResults(parsed));
    console.log('\nParsed JSON:');
    console.log(JSON.stringify(parsed, null, 2));
  }
}
