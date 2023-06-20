// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Table component.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import Cell from './Cell';

/**
 * @param {
 *  bookmarks: Bookmark[] - the bookmarks for this table to display
 *  onBookmarkUpdate: async function(bookmark: Bookmark): { success: bool} - called when the table updates a bookmark
 *  onBookmarkDelete: async function(bookmark: Bookmark) - called when the table's delete button is pressed
 * }
 */
export default function Table({ bookmarks, onBookmarkUpdate, onBookmarkDelete }) {
  return (
    <table className='table table-sm border rounded border-2' style={{ borderCollapse: 'separate', borderSpacing: '0px' }}>
      <thead>
        <tr>
          <th>Route</th>
          <th>URL</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {bookmarks.map(bookmark => (
          <tr key={bookmark.id}>
            <Cell
              value={bookmark.route}
              live={bookmark.live}
              onUpdate={value => onBookmarkUpdate({ id: bookmark.id, route: value })}
              prefix='aka/'
            />
            <Cell
              value={bookmark.url}
              onUpdate={value => onBookmarkUpdate({ id: bookmark.id, url: value })}
            />
            <td valign='middle'>
              <button
                className='btn'
                onMouseDown={() => onBookmarkDelete(bookmark)}
                style={{ border: '0px', '--bs-btn-hover-color': '#dc3545', width: '10px' }}
              >
                <i className='fa fa-trash' />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
