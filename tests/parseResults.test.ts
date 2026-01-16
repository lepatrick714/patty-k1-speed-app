/**
 * Tests for K1 Speed race results parser
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  parseSubject,
  parseResultRow,
  parseResultsTable,
  parseRaceEmail,
} from '../src/parseResults.js';

describe('parseSubject', () => {
  it('should parse a standard K1 Speed subject line', () => {
    const subject = 'Your Race Results at K1 Speed Anaheim T1 12/29/25 07:17 PM';
    const result = parseSubject(subject);

    assert.ok(result);
    assert.strictEqual(result.location, 'K1 Speed Anaheim');
    assert.strictEqual(result.track, 'T1');
    assert.strictEqual(result.date.getMonth(), 11); // December (0-indexed)
    assert.strictEqual(result.date.getDate(), 29);
    assert.strictEqual(result.date.getFullYear(), 2025);
    assert.strictEqual(result.date.getHours(), 19); // 7 PM
    assert.strictEqual(result.date.getMinutes(), 17);
  });

  it('should parse subject with different location', () => {
    const subject = 'Your Race Results at K1 Speed Ontario T2 01/15/26 10:30 AM';
    const result = parseSubject(subject);

    assert.ok(result);
    assert.strictEqual(result.location, 'K1 Speed Ontario');
    assert.strictEqual(result.track, 'T2');
    assert.strictEqual(result.date.getHours(), 10);
  });

  it('should return null for non-matching subject', () => {
    const subject = 'Your Amazon order has shipped';
    const result = parseSubject(subject);

    assert.strictEqual(result, null);
  });

  it('should handle 12 PM correctly', () => {
    const subject = 'Your Race Results at K1 Speed Anaheim T1 12/29/25 12:00 PM';
    const result = parseSubject(subject);

    assert.ok(result);
    assert.strictEqual(result.date.getHours(), 12);
  });

  it('should handle 12 AM correctly', () => {
    const subject = 'Your Race Results at K1 Speed Anaheim T1 12/29/25 12:00 AM';
    const result = parseSubject(subject);

    assert.ok(result);
    assert.strictEqual(result.date.getHours(), 0);
  });
});

describe('parseResultRow', () => {
  it('should parse a tab-separated result row', () => {
    const row = '1\tKevin Ruiz\t28.844\t8\t11\t36.975\t0.000\t1244 (+44)';
    const result = parseResultRow(row);

    assert.ok(result);
    assert.strictEqual(result.position, 1);
    assert.strictEqual(result.racer, 'Kevin Ruiz');
    assert.strictEqual(result.bestTime, '28.844');
    assert.strictEqual(result.bestLap, 8);
    assert.strictEqual(result.laps, 11);
    assert.strictEqual(result.avg, '36.975');
    assert.strictEqual(result.gap, '0.000');
    assert.strictEqual(result.k1rs, '1244 (+44)');
  });

  it('should parse last place result', () => {
    const row = '10\tGiovanni Almanza\t33.292\t8\t10\t43.115\t4.448\t1204 (+4)';
    const result = parseResultRow(row);

    assert.ok(result);
    assert.strictEqual(result.position, 10);
    assert.strictEqual(result.racer, 'Giovanni Almanza');
    assert.strictEqual(result.gap, '4.448');
  });

  it('should return null for header row', () => {
    const row = '#\tRacer\tBest Time\tBest Lap\tLaps\tAvg.\tGap\tK1RS';
    const result = parseResultRow(row);

    assert.strictEqual(result, null);
  });

  it('should return null for incomplete row', () => {
    const row = '1\tKevin Ruiz\t28.844';
    const result = parseResultRow(row);

    assert.strictEqual(result, null);
  });
});

describe('parseResultsTable', () => {
  it('should parse a full results table', () => {
    const body = `
#	Racer	Best Time	Best Lap	Laps	Avg.	Gap	K1RS
1	Kevin Ruiz	28.844	8	11	36.975	0.000	1244 (+44)
2	Lam Le	28.857	9	12	34.283	0.013	1584 (+40)
3	Irl Strachan	29.022	5	11	39.160	0.178	1356 (+32)
`;
    const results = parseResultsTable(body);

    assert.strictEqual(results.length, 3);
    assert.strictEqual(results[0].racer, 'Kevin Ruiz');
    assert.strictEqual(results[1].racer, 'Lam Le');
    assert.strictEqual(results[2].racer, 'Irl Strachan');
  });

  it('should handle empty body', () => {
    const results = parseResultsTable('');
    assert.strictEqual(results.length, 0);
  });

  it('should skip non-result lines', () => {
    const body = `
Some header text
More text here

#	Racer	Best Time	Best Lap	Laps	Avg.	Gap	K1RS
1	Kevin Ruiz	28.844	8	11	36.975	0.000	1244 (+44)

Footer text
Thanks for racing!
`;
    const results = parseResultsTable(body);

    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].racer, 'Kevin Ruiz');
  });
});

describe('parseRaceEmail', () => {
  it('should parse a complete race email', () => {
    const subject = 'Your Race Results at K1 Speed Anaheim T1 12/29/25 07:17 PM';
    const body = `
#	Racer	Best Time	Best Lap	Laps	Avg.	Gap	K1RS
1	Kevin Ruiz	28.844	8	11	36.975	0.000	1244 (+44)
2	Lam Le	28.857	9	12	34.283	0.013	1584 (+40)
`;
    const parsed = parseRaceEmail(subject, body);

    assert.ok(parsed);
    assert.strictEqual(parsed.raceInfo.location, 'K1 Speed Anaheim');
    assert.strictEqual(parsed.raceInfo.track, 'T1');
    assert.strictEqual(parsed.results.length, 2);
    assert.strictEqual(parsed.results[0].racer, 'Kevin Ruiz');
  });

  it('should return null for invalid subject', () => {
    const subject = 'Invalid subject';
    const body = '1\tKevin Ruiz\t28.844\t8\t11\t36.975\t0.000\t1244 (+44)';
    const parsed = parseRaceEmail(subject, body);

    assert.strictEqual(parsed, null);
  });
});
