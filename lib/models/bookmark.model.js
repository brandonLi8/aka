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
   * Create a in-memory Bookmark instance.
   * @constructor
   */
  constructor(id, route, url, live) {

    // @public {string} route - The route of the bookmark.
    this.route = route || '';

    // @public {string} url - The URL of the bookmark.
    this.url = url || '';

    // @public {boolean} live - represents if the bookmark is "live". If it isn't live, we don't redirect to it. This is
    // needed for when we first create a bookmark, we create it as empty (from the UX perspective, I want to create and
    // construct from the table itself). To prevent duplicate routes on create (duplicate empty route to be precise), we
    // mark the bookmark as not live, and on the first valid edit to the route we mark it as live.
    this.live = live || false;

    // @public (read-only) {string} id - lexicographic-ally ordered unique identifier
    this.id = id || assert(false, 'id must be provided');
  }

  /**
   * Creates a new Bookmark instance, that hasn't been created before. Does not persist.
   */
  static create() {
    return new Bookmark(generateID(), '', '', false);
  }

  /**
   * Constructs a in-memory bookmark instance from a db load.
   */
  static fromLoad(payload) {
    return new Bookmark(payload.id, payload.route, payload.url, payload.live);
  }
}
