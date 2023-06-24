// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Functions that query the backend
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

/**
 * Gets all the bookmarks.
 */
export async function getBookmarks() {
  try {
    return (await axios.get('/bookmark/all')).data;
  }
  catch(error) {
    console.error('Failed to fetch bookmarks:', error);
  }
}

/**
 * Creates a bookmark.
 */
export async function createBookmark() {
  try {
    return (await axios.post('/bookmark')).data;
  }
  catch(error) {
    console.error('Failed to create bookmark:', error);
  }
}

/**
 * Updates a bookmark.
 */
export async function updateBookmark(data) {
  try {
    return (await axios.put('/bookmark', data)).data;
  }
  catch(error) {
    console.error('Failed to update bookmark:', error);
  }
}

/**
 * Deletes a bookmark.
 */
export async function deleteBookmark(data) {
  try {
    return (await axios.delete('/bookmark', { data })).data;
  }
  catch(error) {
    console.error('Failed to delete bookmark:', error);
  }
}