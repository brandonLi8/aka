// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Controller for redirecting a bookmarked route to the corresponding URL.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import { StatusCodes } from 'http-status-codes';
import { nthIndexOf } from '../utils/utils.js';
import { db, index } from '../utils/database.js';

/**
 * Redirects the request to the bookmarked URL.
 *
 * @param {express.Request} - request
 * @param {express.Response} res - response
 */
export async function redirect(req, res) {

  const routeSubRouteSplitIndex = nthIndexOf(req.url, '/', 2);

  // Parse the route and sub-route of the request.
  const route = req.url.substring(0, routeSubRouteSplitIndex);
  const subRoute = req.url.substring(routeSubRouteSplitIndex);

  try {
    const bookmark = await db.get(await index.get(route));

    res.redirect(bookmark.url + subRoute);
  } catch (err) {
    return res.send(`aka/${route} not found. Please double check aka/admin.`);
  }
}
