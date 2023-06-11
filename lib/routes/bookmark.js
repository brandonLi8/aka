// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Router for bookmarks.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import { Router } from 'express';
import { create, getAll, update, remove } from '../controllers/bookmark.controller.js';

export default {
  route: '/bookmark',

  /**
   * Generates a router for /bookmark.
   *
   * @returns {Router}
   */
  router: () => {
    const router = Router();

    // GET /bookmark/all
    router.route('/all').get(getAll);

    // POST /bookmark
    router.route('/all').get(create);

    // PUT /bookmark
    router.route('/').put(update);

    // DELETE /bookmark
    router.route('/').delete(remove);

    return router;
  }
};