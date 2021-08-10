 // Copyright © 2019-2021 Brandon Li. All rights reserved.

/**
 * The in-memory cache for the URLS, for high read performance.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import fs from 'fs/promises';
import path from 'path';

// constants
const URLS_FILE_PATH = path.join(process.cwd(), 'urls.local.json');

/**
 * @typedef {URLEntry} {
 *   route: {String} - the shortened route.
 *   url: {String} - the url the route maps to.
 * }
 * @public {URLEntry[]} - ordered url entries.
 */
export let cachedURLEntries = null;

/**
 * @public {Object<string, number>} - maps the URLEntry route to the index inside cachedURLEntries.
 */
export let cachedURLEntriesIndices = {};

/**
 * Ensures cachedURLEntries, cachedURLEntriesIndices is updated.
 * @public
 */
export async function ensureCache() {

  // Make sure the URLS_FILE_PATH exists.
  try {
    await fs.access(URLS_FILE_PATH, fs.constants.F_OK);
  }
  catch {
    await fs.writeFile(URLS_FILE_PATH, JSON.stringify([]));
  }

  if (!cachedURLEntries) {
    cachedURLEntries = JSON.parse(await fs.readFile(URLS_FILE_PATH, 'utf8'));
    cachedURLEntriesIndices = {};

    for (let i = 0; i < cachedURLEntries.length; i++) {
      cachedURLEntriesIndices[cachedURLEntries[i].route] = i;
    }
  }
}

/**
 * Writes cachedURLEntries to disk.
 * @public
 */
export async function writeToDisk() {
  await fs.writeFile(URLS_FILE_PATH, JSON.stringify(cachedURLEntries));
}