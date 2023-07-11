// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Utilities for handling the autolaunch feature, which starts up aka at login, and prompts the user non-intrusively
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import inquirer from 'inquirer';
import AutoLaunch from 'auto-launch';
import { connect, meta_db } from '../utils/database.js';
import { getOrDefault } from '../utils/utils.js';
import assert from 'assert/strict';

// constants
const LAST_PROMPT_AUTO_LAUNCH_KEY = 'last_prompt_auto_launch';
const PROMPT_AUTO_LAUCH_INTERVAL = 5 * 24 * 60 * 60 * 1000; // 5 days

// Create the auto-launch instance
const akaAutoLaunch = new AutoLaunch({
  name: 'aka',
  path: process.argv[1],
  isHidden: true,
  mac: {
    useLaunchAgent: true
  }
});

/**
 * Non-intrusively prompts the user if they would like enable auto-launch.
 */
export async function promptEnableAutoLaunch() {

  // If the user has already enabled auto launch, no-op.
  if (await isAutoLaunchEnabled()) {
    return;
  }

  await connect();
  const last_prompt_auto_launch = await getOrDefault(meta_db, LAST_PROMPT_AUTO_LAUNCH_KEY, new Date(0));

  // Only prompt every `PROMPT_AUTO_LAUCH_INTERVAL` at maximum.
  if (Date.now() - last_prompt_auto_launch >= PROMPT_AUTO_LAUCH_INTERVAL) {
    const { autoLaunch } = await inquirer.prompt([ {
      type: 'confirm',
      name: 'autoLaunch',
      message: 'Would you like to automatically launch AKA at login?',
      default: true
    } ]);

    if (autoLaunch) {
      await enableAutoLaunch();
    }
    else {
      await meta_db.put(LAST_PROMPT_AUTO_LAUNCH_KEY, Date.now());
    }
  }
}

/**
 * Enables auto-launch.
 */
export async function enableAutoLaunch() {
  await akaAutoLaunch.enable();

  // Cross validate that auto-launch is enabled.
  assert(await isAutoLaunchEnabled(), 'Failed to enable auto-launch.');

  console.log('Successfully enabled auto-launch.');
}

/**
 * Disables auto-launch.
 */
export async function disableAutoLaunch() {
  await akaAutoLaunch.disable();

  // Cross validate that auto-launch is disabled.
  assert(!await isAutoLaunchEnabled(), 'Failed to enable auto-launch.');

  console.log('Successfully disabled auto-launch.');
}

/**
 * Returns if auto-launch is enabled.
 */
export async function isAutoLaunchEnabled() {
  return akaAutoLaunch.isEnabled();
}