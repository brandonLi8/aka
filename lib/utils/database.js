// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Exposes a connection to the local on-disk database that aka uses to store bookmarks.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

import path from 'path';
import { Level } from 'level';

/**
 * @public {Level} - db connection
 */
export let db = null;

/**
 * @public {Level} - the bookmarks database, for quick lookup of bookmarks by route
 */
export let bookmarks_db = null;

/**
 * @public {Level} - the index database, for quick lookup of bookmarks by route
 */
export let index_db = null;


/**
 * Connects the database, or creates the database if this is the first time.
 */
export async function connect() {
  db = new Level(path.join(process.env.DATA_DIR, 'data'));
  await db.open();

  if (db.status != 'open') {
    throw new Error('database failed to open');
  }

  // Bookmarks level
  bookmarks_db = db.sublevel('bookmarks_db', { valueEncoding: 'json' });
  await bookmarks_db.open();

  if (bookmarks_db.status != 'open') {
    throw new Error('bookmarks_db database failed to open');
  }

  // Index level
  index_db = db.sublevel('index_db');
  await index_db.open();

  if (index_db.status != 'open') {
    throw new Error('index_db database failed to open');
  }
}
