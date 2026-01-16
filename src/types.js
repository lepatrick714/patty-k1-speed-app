/**
 * @typedef {Object} RaceResult
 * @property {number} position - Race position (1st, 2nd, etc.)
 * @property {string} racer - Racer name
 * @property {string} bestTime - Best lap time (e.g., "28.844")
 * @property {number} bestLap - Lap number with best time
 * @property {number} laps - Total laps completed
 * @property {string} avg - Average lap time
 * @property {string} gap - Gap to leader
 * @property {string} k1rs - K1RS score with change (e.g., "1244 (+44)")
 */

/**
 * @typedef {Object} RaceInfo
 * @property {string} location - Track location (e.g., "K1 Speed Anaheim")
 * @property {string} track - Track identifier (e.g., "T1")
 * @property {Date} date - Race date and time
 * @property {string} rawSubject - Original email subject
 */

/**
 * @typedef {Object} ParsedRaceEmail
 * @property {RaceInfo} raceInfo - Race metadata
 * @property {RaceResult[]} results - Array of race results
 * @property {string} rawBody - Original email body
 */

export {};
