// Copyright © 2021-2023 Brandon Li. All rights reserved.

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
import tcpPortUsed from 'tcp-port-used';
import { ensureCache } from './utils/in-memory-cache.js';
import { fileURLToPath } from 'url';
import { redirect } from './controllers/redirect.controller.js';

// constants
const DEFAULT_WEB_PORT = 80;

/**
 * Starts the application.
 */
export async function start() {

  // Ensure that the DEFAULT_WEB_PORT is not taken.
  if (await tcpPortUsed.check(DEFAULT_WEB_PORT)) {
    return console.error(`port ${DEFAULT_WEB_PORT} is already taken.`);
  }

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

// When this script is called directly, start the server.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  start();
}