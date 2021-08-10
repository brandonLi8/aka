 // Copyright © 2019-2021 Brandon Li. All rights reserved.

/**
 * Router for URLS.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import { Router } from 'express';
import { getAll, update, remove } from '../controllers/url.controller.js';

export default {
  route: '/url',

  /**
   * Generates a router for url.
   *
   * @returns {Router}
   */
  router: () => {
    const router = Router();

    // GET /url/all
    router.route('/all').get(getAll);

    // POST /url
    router.route('/').post(update);

    // DELETE /url
    router.route('/').delete(remove);

    return router;
  }
};