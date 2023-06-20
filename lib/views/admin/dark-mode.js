// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Provides dark-mode functionality.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

/**
 * @enum - color mode preferences.
 */
export const ColorModePreference = {
  DARK: 'dark',
  LIGHT: 'light',
};

/**
 * Determines the user's preferred color mode based on the browser setting.
 *
 * @returns {ColorModePreference} The user's preferred color mode.
 */
export function getColorModePreference() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // updateColorMode(ColorModePreference.DARK);
    return ColorModePreference.DARK;
  }
  else {
    return ColorModePreference.LIGHT;
  }
}

/**
 * Toggles the color mode to the opposite value.
 */
export function toggleColorMode(colorMode) {
  const newColorMode = colorMode === ColorModePreference.DARK ? ColorModePreference.LIGHT : ColorModePreference.DARK;
  updateColorMode(newColorMode);
  console.log(colorMode, newColorMode)
  return newColorMode;
}

/**
 * Updates the color mode of the document based on the specified color mode preference. In other words, it actually
 * applies the color change to the page.
 *
 * @param {ColorModePreference} colorMode - The color mode preference.
 */
export function updateColorMode(colorMode) {
  if (colorMode === ColorModePreference.DARK) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
}
