// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Defines the Bookmark model/schema for the database.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import { generateID } from '../utils/utils.js';

export default class Bookmark {
  /**
   * Create a new Bookmark instance.
   * @constructor
   * @param {string} route - The route of the bookmark.
   * @param {string} url - The URL of the bookmark.
   */
  constructor(route, url) {

    // @public {string}
    this.route = route;
    this.url = url;

    // @public (read-only) {String} - lexicographic-ally ordered unique identifier
    this id = generateID();
  }
}
