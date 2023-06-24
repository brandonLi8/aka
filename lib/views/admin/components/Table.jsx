// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Table component.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import TextInput from './TextInput';
import Dropdown from './Dropdown';

/**
 * @param {
 *  bookmarks: Bookmark[] - the bookmarks for this table to display
 *  onBookmarkUpdate: async function(bookmark: Bookmark): { success: bool } - called when the table updates a bookmark
 *  onBookmarkDelete: async function(bookmark: Bookmark) - called when the table's delete button is pressed
 * }
 */
export default function Table({ bookmarks, onBookmarkUpdate, onBookmarkDelete }) {
  return (
    <table className='table' style={{ borderCollapse: 'separate', borderSpacing: '0px' }}>
      <thead>
        <tr>
          <th className='col-md-5'>Route</th>
          <th>Location</th>
          <th style={{ width: '50px' }}></th>
        </tr>
      </thead>
      <tbody>
        {bookmarks.map(bookmark => (
          <tr key={bookmark.id}>

            {/* route field */}
            <td valign='middle'>
              <TextInput
                value={bookmark.route}
                live={bookmark.live}
                onUpdate={value => onBookmarkUpdate({ id: bookmark.id, route: value })}
                prefix='aka/'
              >
                <Dropdown
                  options={['url', 'file']}
                  value={bookmark.resourceType}
                  onUpdate={value => onBookmarkUpdate({ id: bookmark.id, resourceType: value })}
                  title='Resource Type'
                />
              </TextInput>
            </td>

            {/* location field */}
            <td valign='middle'>
              <TextInput
                value={bookmark.location}
                onUpdate={value => onBookmarkUpdate({ id: bookmark.id, location: value })}
              >
              </TextInput>
            </td>

            {/* delete button field */}
            <td valign='middle'>
              <button
                className='btn'
                onMouseDown={() => onBookmarkDelete(bookmark)}
                style={{ border: '0px', '--bs-btn-hover-color': 'rgb(var(--bs-danger-rgb))', width: '10px' }}
                title='Delete bookmark'
              >
                <i className='fas fa-trash' />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
