// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Controller for redirecting a bookmarked route to the corresponding URL.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import { bookmarks_db, index_db } from '../utils/database.js';

/**
 * Redirects the request to the bookmarked URL.
 *
 * @param {express.Request} - request
 * @param {express.Response} res - response
 */
export async function redirect(req, res) {
  const url = req.url.substring(1);

  const subrouteStartIndex = url.indexOf('/');

  // Parse the route and sub-route of the request.
  const route = url.substring(0, subrouteStartIndex < 0 ? url.length : subrouteStartIndex);
  const subRoute = url.substring(subrouteStartIndex < 0 ? url.length : subrouteStartIndex);

  try {
    const bookmark = await bookmarks_db.get(await index_db.get(route));

    res.redirect(bookmark.location + subRoute);
  }
  catch(err) {
    return res.send(`aka/${route} not found. Please double check aka/admin.`);
  }
}