// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Controller for redirecting a bookmarked route to the corresponding URL.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import { StatusCodes } from 'http-status-codes';
import { cachedURLEntries, cachedURLEntriesIndices } from '../utils/in-memory-cache.js';
import { nthIndexOf } from '../utils/utils.js';

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

  // Get the index in the table that corresponds to the request.
  const cachedURLEntryIndex = cachedURLEntriesIndices[route];
  if (cachedURLEntryIndex === undefined) {
    return res.send(`aka/${route} not found. Please double check aka/admin.`);
  }

  // Get the URL from the cached URL entries.
  const { url } = cachedURLEntries[cachedURLEntryIndex]

  res.redirect(url + subRoute);
}