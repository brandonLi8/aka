// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Controller for Bookmarks.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import { db, index } from '../utils/database.js';
import { keyExists } from '../utils/utils.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Gets all the URLS.
 *
 * @param {express.Request} req - request
 * @param {express.Response} res - response
 */
export async function getAll(req, res) {
  try {
    let bookmarks = [];

    // Stream the bookmarks from the LevelDB database
    for await (const [id, bookmark] of db.iterator()) {
      console.log(id, bookmark)
    }

    res.json(bookmarks)

  } catch (err) {
    console.error('Error retrieving bookmarks', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error retrieving bookmarks' });
  }
}

/**
 * Creates a bookmark, and writes to disk.
 *
 * @param {{
 *  body: {
 *    route: string - the updated route.
 *    url: string - the updated url.
 *  }
 * }} - request
 *
 * @param {express.Response} res - response
 */
export async function create({ body: { route, url } }, res) {
  const bookmark = new Bookmark(route, url);

  try {
    await db.put(bookmark.id, bookmark)
    await index.put(bookmark.route, bookmark.id)

    res.json({ id: bookmark.id })

  } catch (err) {
    console.error('Error creating bookmark', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating bookmark' });
  }
};

/**
 * Updates a bookmark, and writes to disk.
 *
 * @param {{
 *  body: {
 *    id: String,
 *    route: string - the updated route, if updated,
 *    url: string - the updated url, if updated
 *  }
 * }} - request
 *
 * @param {express.Response} res - response
 */
export async function update({ body: { id, route, url } }, res) {
  try {
    // Retrieve the existing bookmark from the database
    const bookmark = await db.get(id);

    // If the updated route already exists for another bookmark, return an error
    if (route && route !== bookmark.route) {
      if (await keyExists(index, route)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: `Duplicate route: ${route}` });
      }

      // The route doesn't already exist, so we must update the index.
      await index.del(bookmark.route);
      await index.put(route, id);

      // Update the bookmark route
      bookmark.route = route;
    }

    // Update the bookmark properties if they are provided
    bookmark.url = url || bookmark.url;

    // Update the bookmark in the database
    await db.put(id, bookmark);

    res.json({ id: bookmark.id });
  } catch (err) {
    console.error('Error updating bookmark', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error updating bookmark' });
  }
}

/**
 * Deletes a bookmark from the database.
 *
 * @param {{
 *  params: {
 *    id: String - the ID of the bookmark to delete
 *  }
 * }} - request
 *
 * @param {express.Response} res - response
 */
export async function remove({ params: { id } }, res) {
  try {
    // Retrieve the bookmark from the database
    const bookmark = await db.get(id);

    // Delete the bookmark from the database
    await db.del(id);

    // Delete the bookmark route from the index database
    await index.del(bookmark.route);

    res.json({ message: 'Bookmark deleted successfully' });
  } catch (err) {
    console.error('Error deleting bookmark', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting bookmark' });
  }
}
