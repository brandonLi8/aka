#!/usr/bin/env node

// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * The command line interface for AKA.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

import { program } from 'commander';
import { start } from '../lib/index.js';
import forever from 'forever';
import path from 'path';
import mkdirp from 'mkdirp';
import os from 'os';
import appRoot from 'app-root-path';

program
  .command('dev')
  .description('run aka once (not in the background)')
  .action(start);

program
  .command('start')
  .description('run the aka server continuously in the background.')
  .option('-d, --data-dir <path>', 'path for storing the application data', '$HOME/.aka/data')
  .action(({ dataDir }) => {
    forever.list(false, async (error, processes) => {
      if (error) {
        return console.error('Error occurred while checking the aka server status:', error);
      }

      if (processes && processes.find(process => process.uid === 'aka')) {
        return console.log('aka is already running. Use `aka stop` to stop it.');
      }

      const logDir = path.join(process.env.HOME || os.homedir(), './.aka/log');
      await mkdirp.sync(logDir);

      forever.startDaemon(path.join(appRoot.path, './lib/index.js'), {
        uid: 'aka',
        outFile: path.join(logDir, 'aka.out'),
        errFile: path.join(logDir, 'aka.err'),
        logFile: path.join(logDir, 'aka.log'),
      });

      console.log('Running in background process. Visit aka/ in your browser');
    });
  });

program
  .command('stop')
  .description('run the aka server continuously in the background.')
  .action(() => {
    forever.stop('aka');
    console.log('Stopped.');
  });

program.parse(process.argv)