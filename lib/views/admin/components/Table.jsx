// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Table component.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import TextInput from './TextInput';
import Dropdown from './Dropdown';
import Cell, { CellStatus } from './Cell';

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
          <th className='col-md-4'>Route</th>
          <th>Location</th>
          <th style={{ width: '50px' }}></th>
        </tr>
      </thead>
      <tbody>
        {bookmarks.map(bookmark => (
          <tr key={bookmark.id}>

            {/* route field */}
            <Cell
              onUpdate={onBookmarkUpdate}
              initialStatus={bookmark.live ? CellStatus.LOADING : new CellStatus.ERROR('duplicate route')}
            >
              {(status, handleUpdate) => (
                <TextInput
                  value={bookmark.route}
                  onUpdate={value => handleUpdate({ id: bookmark.id, route: value })}
                  status={status}
                  prefix='aka/'
                />
              )}
            </Cell>

            {/* location field */}
            <Cell onUpdate={onBookmarkUpdate}>
              {(status, handleUpdate) => (
                <div className='d-flex align-items-center'>
                  <Dropdown
                    options={[ 'url', 'file' ]}
                    initialValue={bookmark.resourceType}
                    onUpdate={value => handleUpdate({ id: bookmark.id, resourceType: value })}
                    title='Resource Type'
                    icons={{
                      url: 'fa fa-link ms-1',
                      file: 'far fa-folder ms-1'
                    }}
                  />
                  <TextInput
                    value={bookmark.location}
                    onUpdate={value => handleUpdate({ id: bookmark.id, location: value })}
                    status={status}
                  />
                </div>
              )}
            </Cell>


            {/* delete button field */}
            <Cell onUpdate={_.identity}>
              {(status, handleUpdate) => (
                <button
                  className='btn'
                  onMouseDown={() => onBookmarkDelete(bookmark)}
                  style={{ 'border': '0px', '--bs-btn-hover-color': 'rgb(var(--bs-danger-rgb))', 'width': '10px' }}
                  title='Delete bookmark'
                >
                  <i className='fas fa-trash' />
                </button>
              )}
            </Cell>


          </tr>
        ))}
      </tbody>
    </table>
  );
}