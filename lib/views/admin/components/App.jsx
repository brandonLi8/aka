// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Main entry point for admin view.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import Table from './Table';
import { getBookmarks, createBookmark, updateBookmark, deleteBookmark } from '../api'

function App() {
  const [bookmarks, setBookmarks] = React.useState([]);

  // Fetch all the bookmarks first
  React.useEffect(async () => setBookmarks(await getBookmarks()), []);

  // Adds a row to the table
  async function addRow() {
    let { bookmark } = await createBookmark();
    setBookmarks(bookmarks => [...bookmarks, bookmark]);
  };

  // Deletes a row in the table
  async function deleteRow(bookmark) {
    await deleteBookmark(bookmark);
    setBookmarks(bookmarks => bookmarks.filter(b => b.id !== bookmark.id));
  };

  return (
    <div class='mx-4'>
      <button onClick={addRow} className='btn btn-outline-success btn-sm my-3'>
        Add Route
      </button>
      <Table
        bookmarks={bookmarks}
        onBookmarkUpdate={updateBookmark}
        onBookmarkDelete={deleteRow}
      />
    </div>
  );
}

export default App;
