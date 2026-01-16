/**
 * K1 Speed Email Fetcher
 * Fetches K1 Speed race result emails via IMAP with OAuth2
 */

import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { config } from 'dotenv';
import { getAccessToken, getUserEmail } from './auth.js';

config();

/**
 * @typedef {Object} FetchedEmail
 * @property {string} subject - Email subject
 * @property {string} text - Plain text body
 * @property {string} html - HTML body
 * @property {Date} date - Email date
 */

/**
 * Generate XOAUTH2 token for IMAP authentication
 * @param {string} user - Email address
 * @param {string} accessToken - OAuth2 access token
 * @returns {string} Base64 encoded XOAUTH2 string
 */
function generateXOAuth2Token(user, accessToken) {
  const authString = `user=${user}\x01auth=Bearer ${accessToken}\x01\x01`;
  return Buffer.from(authString).toString('base64');
}

/**
 * Create IMAP connection configuration with OAuth2
 * @param {string} email - User's email address
 * @param {string} accessToken - OAuth2 access token
 * @returns {Object} IMAP config object
 */
function getImapConfig(email, accessToken) {
  return {
    user: email,
    xoauth2: generateXOAuth2Token(email, accessToken),
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 10000,
  };
}

/**
 * Search for K1 Speed race result emails
 * @param {Object} options - Search options
 * @param {number} [options.limit=50] - Maximum emails to fetch
 * @param {Date} [options.since] - Only fetch emails since this date
 * @returns {Promise<FetchedEmail[]>}
 */
export async function fetchK1SpeedEmails(options = {}) {
  const { limit = 50, since } = options;

  // Get OAuth2 credentials
  console.log('Authenticating with Gmail...');
  const accessToken = await getAccessToken();
  const email = await getUserEmail();
  console.log(`Authenticated as: ${email}\n`);

  return new Promise((resolve, reject) => {
    const imapConfig = getImapConfig(email, accessToken);
    const imap = new Imap(imapConfig);
    const emails = [];

    imap.once('ready', () => {
      // Use "All Mail" to search across all folders/labels
      // Gmail stores all emails here regardless of labels
      imap.openBox('[Gmail]/All Mail', true, (err) => {
        if (err) {
          // Fallback to INBOX if All Mail doesn't exist
          console.log('Could not open All Mail, falling back to INBOX...');
          imap.openBox('INBOX', true, (inboxErr) => {
            if (inboxErr) {
              imap.end();
              reject(inboxErr);
              return;
            }
            searchAndFetch();
          });
          return;
        }
        searchAndFetch();
      });

      function searchAndFetch() {
        // Build search criteria
        const searchCriteria = [
          ['SUBJECT', 'Your Race Results at K1 Speed'],
        ];

        if (since) {
          searchCriteria.push(['SINCE', since]);
        }

        imap.search(searchCriteria, (searchErr, results) => {
          if (searchErr) {
            imap.end();
            reject(searchErr);
            return;
          }

          if (!results || results.length === 0) {
            console.log('No K1 Speed emails found.');
            imap.end();
            resolve([]);
            return;
          }

          console.log(`Found ${results.length} K1 Speed email(s)`);

          // Limit results
          const toFetch = results.slice(-limit);

          const fetch = imap.fetch(toFetch, {
            bodies: '',
            struct: true,
          });

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (parseErr, parsed) => {
                if (parseErr) {
                  console.error('Error parsing email:', parseErr);
                  return;
                }

                emails.push({
                  subject: parsed.subject || '',
                  text: parsed.text || '',
                  html: parsed.html || '',
                  date: parsed.date || new Date(),
                });
              });
            });
          });

          fetch.once('error', (fetchErr) => {
            imap.end();
            reject(fetchErr);
          });

          fetch.once('end', () => {
            imap.end();
          });
        });
      }
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.once('end', () => {
      // Sort by date, newest first
      emails.sort((a, b) => b.date.getTime() - a.date.getTime());
      resolve(emails);
    });

    imap.connect();
  });
}

/**
 * Fetch emails and return as array (main entry point)
 * @param {Object} options - Fetch options
 * @returns {Promise<FetchedEmail[]>}
 */
export async function getEmails(options = {}) {
  try {
    const emails = await fetchK1SpeedEmails(options);
    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error.message);
    throw error;
  }
}

// Run directly for testing
if (process.argv[1] && process.argv[1].includes('fetchEmails')) {
  console.log('Fetching K1 Speed emails...\n');

  getEmails({ limit: 10 })
    .then((emails) => {
      console.log(`\nFetched ${emails.length} email(s):\n`);
      for (const email of emails) {
        console.log(`- ${email.subject}`);
        console.log(`  Date: ${email.date.toLocaleString()}`);
        console.log();
      }
    })
    .catch((err) => {
      console.error('Failed:', err.message);
      process.exit(1);
    });
}
