// Copyright © 2021 Brandon Li. All rights reserved.

/**
 * Controller for URLS.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import { StatusCodes } from 'http-status-codes';
import { cachedURLEntries, cachedURLEntriesIndices, writeToDisk } from '../utils/in-memory-cache.js';

/**
 * Gets all the URLS.
 *
 * @param {express.Request} req - request
 * @param {express.Response} res - response
 */
export async function getAll(req, res) {
  res.json(cachedURLEntries);
};

/**
 * Updates an entry in the URL cache, and writes to disk. Can also be used to create a route.
 *
 * @param {{
 *  body: {
 *    index: number - the index of the entry that is updated.
 *    route: string - the updated route.
 *    url: string - the updated url.
 *  }
 * }} - request
 *
 * @param {express.Response} res - response
 */
export async function update({ body: { index, route, url } }, res) {

  // Updated a route, but with a duplicate route that was already there.
  if (Object.prototype.hasOwnProperty.call(cachedURLEntriesIndices, route)
      && cachedURLEntriesIndices[route] !== index) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: `Duplicate route: ${route}` });
  }

  if (index > cachedURLEntries.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: `Invalid index: ${index}` });
  }

  // Added a new route.
  if (cachedURLEntries.length === index) {
    cachedURLEntries.push({ route, url });
    cachedURLEntriesIndices[route] = index;
  }
  else {
    const previousRoute = cachedURLEntries[index].route;
    cachedURLEntries[index] = { route, url };

    delete cachedURLEntriesIndices[previousRoute];
    cachedURLEntriesIndices[route] = index;
  }

  await writeToDisk();
  return res.status(StatusCodes.OK).json({ success: true });
};

/**
 * Removes an entry in the URL cache, and writes to disk.
 *
 * @param {{
 *  body: {
 *    index: number - the index of the entry that was deleted.
 *  }
 * }} - request
 *
 * @param {express.Response} res - response
 */
export async function remove({ body: { index } }, res) {
  if (index >= cachedURLEntries.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: `Cannot remove index: ${index}` });
  }

  const removedEntry = cachedURLEntries[index];
  cachedURLEntries.splice(index, 1);
  delete cachedURLEntriesIndices[removedEntry.route];

  for (let i = index; i < cachedURLEntries.length; i++) {
    cachedURLEntriesIndices[cachedURLEntries[i].route]--;
  }

  await writeToDisk();
  return res.status(StatusCodes.OK).json({ success: true });
};