// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Controller for Bookmarks.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import { bookmarks_db, index_db } from '../utils/database.js';
import { keyExists, isValidURL } from '../utils/utils.js';
import { StatusCodes } from 'http-status-codes';
import Bookmark from '../models/bookmark.model.js';

/**
 * Gets all the bookmarks.
 *
 * @param {express.Request} req - request
 * @param {express.Response} res - response
 */
export async function getAll(req, res) {
  try {
    res.json(await bookmarks_db.values().all());
  }
  catch(err) {
    console.error('Error retrieving bookmarks', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error retrieving bookmarks' });
  }
}

/**
 * Creates a bookmark, and writes to disk.
 *
 * @param {express.Request} req - request
 * @param {express.Response} res - response
 */
export async function create(_, res) {
  try {
    const bookmark = Bookmark.create();

    // If the bookmark is already unique (by route), we can pre-mark as live.
    if (!(await keyExists(index_db, bookmark.route))) {
      bookmark.live = true;
      await index_db.put(bookmark.route, bookmark.id);
    }

    await bookmarks_db.put(bookmark.id, bookmark);
    res.json({ bookmark });
  }
  catch(err) {
    console.error('Error creating bookmark', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating bookmark' });
  }
}

/**
 * Updates a bookmark, and writes to disk.
 *
 * @param {{
 *  body: {
 *    id: String,
 *    route: string - the updated route, if updated,
 *    location: string - the updated location, if updated
 *    resourceType: Bookmark.ResourceType
 *  }
 * }} - request
 *
 * @param {express.Response} res - response
 */
export async function update({ body: { id, route, location, resourceType } }, res) {
  try {

    // Retrieve the existing bookmark from the database
    const bookmark = Bookmark.fromLoad(await bookmarks_db.get(id));

    // If the updated route already exists for another bookmark, return an error
    if (route !== undefined && route !== bookmark.route) {
      if (await keyExists(index_db, route)) {
        return res.json({ error: 'Duplicate route' });
      }

      // The route doesn't already exist, so we must update the index_db.
      if (bookmark.live) {
        await index_db.del(bookmark.route);
      }

      bookmark.live = true;
      await index_db.put(route, id);

      // Update the bookmark route
      bookmark.route = route;
    }

    // Update the bookmark location if provided
    if (location !== undefined) {
      bookmark.location = location;
    }

    if (resourceType) {
      bookmark.resourceType = resourceType;
    }

    // Update the bookmark in the database
    await bookmarks_db.put(id, bookmark);

    if (location !== undefined || resourceType) {
      if (!(await (Bookmark.ResourceValidators[bookmark.resourceType])(bookmark.location))) {
        return res.json({ error: `Invalid ${bookmark.resourceType}` });
      }
    }

    res.json({ success: true });
  }
  catch(err) {
    console.error('Error updating bookmark', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error updating bookmark' });
  }
}

/**
 * Deletes a bookmark from the database.
 *
 * @param {{
 *  body: {
 *    id: String - the ID of the bookmark to delete
 *  }
 * }} - request
 *
 * @param {express.Response} res - response
 */
export async function remove({ body: { id } }, res) {
  try {

    // Retrieve the bookmark from the database
    const bookmark = Bookmark.fromLoad(await bookmarks_db.get(id));

    // Delete the bookmark from the database
    await bookmarks_db.del(id);

    // Delete the bookmark route from the index_db database
    if (bookmark.live) {
      await index_db.del(bookmark.route);
    }

    res.json({ message: 'Bookmark deleted successfully' });
  }
  catch(err) {
    console.error('Error deleting bookmark', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting bookmark' });
  }
}