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
import path, { resolve } from 'path';
import util from 'util';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import { start } from '../lib/index.js';
import { promptEnableAutoLaunch, enableAutoLaunch, isAutoLaunchEnabled, disableAutoLaunch } from '../lib/utils/autolaunch.js';
import { createRequire } from 'node:module';
const { version, description } = createRequire(import.meta.url)('../package.json');

// constants
const DEFAULT_DATA_DIR = path.join(process.env.HOME || os.homedir(), './.aka');
const AKA = String.raw`
_____  |  | _______
\__  \ |  |/ /\__  \
 / __ \|    <  / __ \_
(____  /__|_ \(____  /
     \/     \/     \/
`;


/**
 * The start command for the CLI.
 * @param {Object} options - the options for the command
 * @param {string} options.dataDir - the path to the data directory
 * @param {boolean} options.continuous - if the server should run continuously in the background
 */
async function startAKA({ dataDir, continuous = true }) {
  process.env.DATA_DIR = process.env.DATA_DIR || dataDir ? resolve(dataDir) : DEFAULT_DATA_DIR;

  // Ensure that the server isn't already running.
  if (continuous && (await util.promisify(forever.list)(false) || []).find(process => process.uid === 'aka')) {
    return console.error('aka is already running. Use `aka stop` to stop it.');
  }

  console.log(AKA + '\nThank you for trying AKA!');

  if (!continuous) {
    return start();
  }
  await promptEnableAutoLaunch();

  const logDir = path.join(process.env.DATA_DIR, './log');
  await mkdirp.sync(logDir);

  forever.startDaemon(fileURLToPath(new URL('../lib/index.js', import.meta.url)), {
    uid: 'aka',
    outFile: path.join(logDir, 'aka.out'),
    errFile: path.join(logDir, 'aka.err'),
    logFile: path.join(logDir, 'aka.log')
  });

  console.log('Visit aka/admin in your browser.');
}

program
  .name('aka')
  .description(AKA.trimStart() + '\n' + description)
  .version(version);

program
  .command('start')
  .description('starts the aka server in the background.')
  .option('-d, --data-dir <path>', 'path for storing the application data (default: $HOME/.aka/data)')
  .option('-C, --no-continuous', 'If provided, the server wont run continuously in the background')
  .action(startAKA);

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

program
  .command('enable-autolaunch')
  .description('automatically launch aka at login')
  .action(enableAutoLaunch);

program
  .command('disable-autolaunch')
  .description('disable automatically launching aka at login')
  .action(disableAutoLaunch);

program
  .command('autolaunch-status')
  .description('check if aka is set to automatically launch at login')
  .action(async () => {
    if (await isAutoLaunchEnabled()) {
      console.log('Auto-launch is enabled.');
    }
    else {
      console.log('Auto-launch is disabled.');
    }
  });


program.action(startAKA);
program.parse(process.argv);

// See https://stackoverflow.com/a/73525885
const originalEmit = process.emit;
process.emit = function(name, data, ...args) {
  if (
    name === 'warning'

  // if you want to only stop certain messages, test for the message here:
  // && data.message.includes(`Fetch API`)
  ) {
    return false;
  }
  return originalEmit.apply(process, arguments);
};