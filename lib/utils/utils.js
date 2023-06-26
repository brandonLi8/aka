// Copyright © 2021-2023 Brandon Li. All rights reserved.

// modules
import { isAbsolute } from 'path';
import { stat } from 'fs/promises';
import { URL } from 'url';

/**
 * Checks if a key exists in the given database.
 *
 * @param {Level} database - The database to check.
 * @param {string} key - The key to check for existence.
 * @returns {boolean} - True if the key exists, false otherwise.
 */
export async function keyExists(database, key) {
  try {
    await database.get(key);
    return true;
  }
  catch(err) {
    if (err.code === 'LEVEL_NOT_FOUND') {
      return false;
    }
    throw err;
  }
}

/**
 * Generates a unique id based that is lexicographical ordered.
 * @returns {String}
 */
export function generateID() {

  // Pad with leading zeros for consistent length
  const timestamp = Date.now().toString().padStart(13, '0');

  // Pad with leading zeros for consistent length.
  const paddedCounter = (counter++).toString().padStart(6, '0');
  return `${timestamp}${paddedCounter}`;
}

// Use an in-memory counter to ensure lexicographical ordering in the event that
// Date.now is called within the same millisecond. Yes, the counter restarts when
// the server restarts, but the most significant digits are timestamp based.
let counter = 0;

/**
 * Returns if a path is a global and file path.
 */
export async function isGlobalFilePath(path) {
  if (!isAbsolute(path)) {
    return false;
  }

  try {
    const stats = await stat(path);
    return stats.isFile();
  }
  catch(error) {
    return false;
  }
}

/**
 * Returns if a string is a valid URL
 */
export function isValidURL(str) {
  try {
    new URL(str);
    return true;
  }
  catch(error) {
    return false;
  }
}