// Copyright © 2021 Brandon Li. All rights reserved.

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