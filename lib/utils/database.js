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
 * @public {Level} - the index database, for quick lookup of bookmarks by route
 */
export let index = null;


/**
 * Connects the database, or creates the database if this is the first time.
 */
export async function connect() {
  db = new Level(path.join(process.env.DATA_DIR, 'data'), { valueEncoding: 'json' });
  await db.open();

  if (db.status != 'open') {
    throw new Error('database failed to open');
  }

  index = db.sublevel('index');
  await index.open();

  if (index.status != 'open') {
    throw new Error('index database failed to open');
  }
}
