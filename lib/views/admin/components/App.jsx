// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Main entry point for admin view.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import Table from './Table';
import NavBar from './NavBar';
import { getBookmarks, createBookmark, updateBookmark, deleteBookmark } from '../api'

function App() {
  // Bookmarks
  const [bookmarks, setBookmarks] = React.useState([]);
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
    <div>
      <NavBar/>
      <div className='my-4 mx-5'>
        <button onClick={addRow} className='btn btn-outline-success btn-sm my-3'>
          Add Bookmark
        </button>
        <Table
          bookmarks={bookmarks}
          onBookmarkUpdate={updateBookmark}
          onBookmarkDelete={deleteRow}
          className='border'
        />
      </div>
    </div>
  );
}

export default App;
