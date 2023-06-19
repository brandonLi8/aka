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
    <div class='m-4'>
      <div className='d-inline-flex flex-column'>
        <img src='/admin/assets/aka-logo.svg' width='120rem'/>
        <button onClick={addRow} className='btn btn-outline-success btn-sm my-3'>
          Add Bookmark
        </button>
      </div>
      <Table
        bookmarks={bookmarks}
        onBookmarkUpdate={updateBookmark}
        onBookmarkDelete={deleteRow}
      />
    </div>
  );
}

export default App;
