#!/usr/bin/env node

// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * The command line interface for AKA.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import forever from 'forever';
import mkdirp from 'mkdirp';
import os from 'os';
import path from 'path';
import util from 'util';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import { start } from '../lib/index.js';

// constants
const DEFAULT_DATA_DIR = path.join(process.env.HOME || os.homedir(), './.aka');
const AKA = String.raw`__
_____  |  | _______
\__  \ |  |/ /\__  \
 / __ \|    <  / __ \_
(____  /__|_ \(____  /
     \/     \/     \/
`;

program
  .command('start')
  .description('run the aka server continuously in the background.')
  .option('-d, --data-dir <path>', 'path for storing the application data (default: $HOME/.aka/data)')
  .option('-C, --no-continuous', 'If provided, the server wont run continuously in the background')
  .action(async ({ dataDir, continuous }) => {
    process.env.DATA_DIR = process.env.DATA_DIR || dataDir || DEFAULT_DATA_DIR;

    // Ensure that the server isn't already running.
    if ((await util.promisify(forever.list)(false) || []).find(process => process.uid === 'aka')) {
      return console.error('aka is already running. Use `aka stop` to stop it.');
    }

    if (!continuous) {
      return start();
    }

    const logDir = path.join(process.env.DATA_DIR, './log');
    await mkdirp.sync(logDir);

    forever.startDaemon(fileURLToPath(new URL('../lib/index.js', import.meta.url)), {
      uid: 'aka',
      outFile: path.join(logDir, 'aka.out'),
      errFile: path.join(logDir, 'aka.err'),
      logFile: path.join(logDir, 'aka.log')
    });

    console.log(AKA + '\nThank you for trying AKA! Visit aka/admin in your browser. ');
  });

program
  .command('stop')
  .description('stop the aka server')
  .action(async () => {

    // Ensure that the server is running.
    if (!(await util.promisify(forever.list)(false) || []).find(process => process.uid === 'aka')) {
      return console.error('aka is not running. Use `aka start` to start it.');
    }

    forever.stop('aka');
    console.log('Stopped.');
  });

program.parse(process.argv);