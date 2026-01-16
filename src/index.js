/**
 * K1 Speed Race Results App
 * Main entry point - fetches emails and parses race results
 */

import { getEmails } from './fetchEmails.js';
import { parseRaceEmail, formatResults } from './parseResults.js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Fetch and parse all K1 Speed race emails
 * @param {Object} options - Options
 * @param {number} [options.limit=50] - Max emails to fetch
 * @param {Date} [options.since] - Only fetch since date
 * @param {boolean} [options.saveJson=false] - Save results to JSON file
 * @returns {Promise<import('./types.js').ParsedRaceEmail[]>}
 */
export async function fetchAndParseRaces(options = {}) {
  const { limit = 50, since, saveJson = false } = options;

  console.log('Fetching K1 Speed race emails...\n');

  const emails = await getEmails({ limit, since });

  if (emails.length === 0) {
    console.log('No emails found.');
    return [];
  }

  console.log(`Processing ${emails.length} email(s)...\n`);

  const parsedRaces = [];

  for (const email of emails) {
    const parsed = parseRaceEmail(email.subject, email.text);

    if (parsed) {
      parsedRaces.push(parsed);
      console.log(formatResults(parsed));
    } else {
      console.log(`Could not parse: ${email.subject}`);
    }
  }

  // Optionally save to JSON
  if (saveJson && parsedRaces.length > 0) {
    const outputDir = join(__dirname, '..', 'output');
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = join(outputDir, `races-${Date.now()}.json`);
    writeFileSync(outputPath, JSON.stringify(parsedRaces, null, 2));
    console.log(`\nResults saved to: ${outputPath}`);
  }

  return parsedRaces;
}

/**
 * Get race statistics for a specific racer
 * @param {import('./types.js').ParsedRaceEmail[]} races - Array of parsed races
 * @param {string} racerName - Racer name to search for
 * @returns {Object} Statistics object
 */
export function getRacerStats(races, racerName) {
  const racerResults = [];

  for (const race of races) {
    const result = race.results.find(
      (r) => r.racer.toLowerCase().includes(racerName.toLowerCase())
    );

    if (result) {
      racerResults.push({
        date: race.raceInfo.date,
        location: race.raceInfo.location,
        track: race.raceInfo.track,
        ...result,
      });
    }
  }

  if (racerResults.length === 0) {
    return { racer: racerName, races: 0 };
  }

  const bestTimes = racerResults.map((r) => parseFloat(r.bestTime));
  const positions = racerResults.map((r) => r.position);

  return {
    racer: racerName,
    races: racerResults.length,
    bestTime: Math.min(...bestTimes).toFixed(3),
    avgBestTime: (bestTimes.reduce((a, b) => a + b, 0) / bestTimes.length).toFixed(3),
    avgPosition: (positions.reduce((a, b) => a + b, 0) / positions.length).toFixed(1),
    wins: positions.filter((p) => p === 1).length,
    podiums: positions.filter((p) => p <= 3).length,
    results: racerResults,
  };
}

// Main execution
if (process.argv[1] && process.argv[1].includes('index')) {
  const args = process.argv.slice(2);
  const saveJson = args.includes('--save');
  const limitArg = args.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 50;

  fetchAndParseRaces({ limit, saveJson })
    .then((races) => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Total races parsed: ${races.length}`);

      if (races.length > 0) {
        // Show unique racers
        const allRacers = new Set();
        for (const race of races) {
          for (const result of race.results) {
            allRacers.add(result.racer);
          }
        }
        console.log(`Unique racers: ${allRacers.size}`);
        console.log(`Racers: ${[...allRacers].join(', ')}`);
      }
    })
    .catch((err) => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}
