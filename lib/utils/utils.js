// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Utilities.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

/**
 * Gets the index of the nth occurrence of a character in a string.
 * @public
 *
 * @param {String} str
 * @param {String} character
 * @param {number} n
 */
export function nthIndexOf(str, pattern, n) {
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === pattern) {
      n--;

      if (!n) return i;
    }
  }
  return str.length;
}

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
  } catch (err) {
    if (err.code == 'LEVEL_NOT_FOUND') {
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
