// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Controller for redirecting a bookmarked route to the corresponding location.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import { StatusCodes } from 'http-status-codes';
import Bookmark from '../models/bookmark.model.js';
import { bookmarks_db, index_db } from '../utils/database.js';
import { keyExists } from '../utils/utils.js';

/**
 * Redirects the request to the bookmarked location.
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
    if (!(await keyExists(index_db, route))) {
      return res.send(`aka/${route} not found. Please double check aka/admin.`);
    }
    const bookmark = Bookmark.fromLoad(await bookmarks_db.get(await index_db.get(route)));

    if (bookmark.resourceType === Bookmark.Resource.URL) {
      res.redirect(bookmark.location + subRoute);
    }
    else if (bookmark.resourceType === Bookmark.Resource.FILE) {
      try {
        res.sendFile(bookmark.location);
      }
      catch(err) {
        res.send(`The file for aka/${route} ("${bookmark.location}") does not exist. Please double check aka/admin.`);
        throw err;
      }
    }
  }
  catch(err) {
    console.error('Error:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Error ${err}` });
  }
}