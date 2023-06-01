#!/usr/bin/env node

// Copyright © 2021-2023-2023 Brandon Li. All rights reserved.

/**
 * The CLI for AKA.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

import { program } from 'commander';
import { start } from '../lib/index.js';
import forever from 'forever';
import path from 'path';

program
  .command('dev')
  .description('run the localhost once (not in the background)')
  .action(start);

program
  .command('start')
  .description('run the aka server continuously in the background.')
  .action(() => {
    forever.startDaemon(path.resolve('./lib/index.js'), {
      uid: 'aka'
    });

    console.log('Running in background process. Visit aka/ in your browser');
  });

program
  .command('stop')
  .description('run the aka server continuously in the background.')
  .action(() => {
    forever.stop(path.resolve('./lib/index.js'), true);

    console.log('Stopped.');
  });

program.parse(process.argv)