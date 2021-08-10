// Copyright © 2019-2021 Brandon Li. All rights reserved.

/**
 * Main entry point.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import url from './routes/url.js';
import { redirect } from './controllers/redirect.controller.js';
import { ensureCache } from './utils/in-memory-cache.js';

// constants
const DEFAULT_WEB_PORT = 80;

/**
 * Starts the application.
 */
async function start() {
  await ensureCache();

  // Create the express application
  const app = express()

    // User bodyParser middleware.
    .use(bodyParser.json())

    // Static Views
    .use(express.static('lib/views', { extensions: [ 'html' ] }))

    // Routers
    .use(url.route, url.router())

  app.get('*', redirect);

  // Serve the application
  app.listen(DEFAULT_WEB_PORT, () => console.log(`listening on aka:${DEFAULT_WEB_PORT}`));
}

start();