// Copyright © 2019-2021 Brandon Li. All rights reserved.

/**
 * Main entry point for admin view.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// constants
const ROUTE_PREFIX = 'aka';
const STATUS_OK = 200;

/**
 * Makes a fetch request to the backend.
 * @public
 *
 * @returns {Object}
 */
async function fetchURL(method, body = null, url = '') {
  const response = await fetch('../url' + url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.status !== STATUS_OK) throw new Error(response.statusText);
  return await response.json();
}

/**
 * Creates a debounce optimized function that only calls the listener after a given period of idle-time.
 * @public
 *
 * @param {function(..*)} listener - the listener of a action that needs to be throttled
 * @param {number} waitTime - the minimum time between invocations of the listener
 * @returns {function(..*)} - the throttled optimized function
 */
function debounce(listener, waitTime = 1000) {
  let debounceOverTimeout;
  return (...args) => {
    if (debounceOverTimeout) {
      clearTimeout(debounceOverTimeout);
    }
    debounceOverTimeout = setTimeout(() => {
      listener(...args);
      debounceOverTimeout = null;
    }, waitTime);
  }
}

/**
 * Adds an editable cell to the row
 *
 * @param {Document.Element} row
 * @param {String} text
 * @param {function} onUpdate
 * @returns {Document.Element}
 */
function addCell(row, text, onUpdate) {

  // Create an editable cell.
  const cell = document.createElement('div');
  cell.contentEditable = 'true';

  cell.addEventListener('input', () => {
    row.classList.remove('table-danger');
    onUpdate();
  });

  cell.appendChild(document.createTextNode(text));
  row.appendChild(document.createElement('td').appendChild(cell).parentNode);
  return cell;
}

/**
 * Creates a row for the table.
 * @public
 *
 * @param {Document.Element} table
 * @param {string} route
 * @param {string} url
 * @param {url} index
 * @returns {Document.Element}
 */
function createRow(table, route, url, index) {
  const row = document.createElement('tr');

  const onUpdate = debounce(async () => {
    try {
      await fetchURL('POST', {
        index,
        route: routeCell.childNodes[0].nodeValue.substring(ROUTE_PREFIX.length),
        url: urlCell.childNodes[0].nodeValue
      });
    }
    catch {
      row.classList.add('table-danger');
    }
  });

  const routeCell = addCell(row, ROUTE_PREFIX + route, onUpdate);
  const urlCell = addCell(row, url, onUpdate);

  const deleteRowButton = document.createElement('button').appendChild(document.createTextNode('Delete')).parentNode;
  deleteRowButton.className = 'btn btn-outline-danger btn-sm';
  row.appendChild(document.createElement('th').appendChild(deleteRowButton).parentNode);

  deleteRowButton.addEventListener('mousedown', async () => {
    try {
      await fetchURL('DELETE', { index });
    }
    catch {
    }
    table.removeChild(row);
  });

  return row;
};

/**
 * Creates a table with HTML out of the URLS.
 *
 * @param {Object[]} urls
 * @returns {Document.Element}
 */
function createTable(urls) {

  // Create the table.
  const table = document.createElement('table');
  table.className = 'table table-sm table-striped';

  // Build the Headers.
  const headers = table.appendChild(document.createElement('tr'));
  headers.appendChild(document.createElement('th').appendChild(document.createTextNode('Route')).parentNode);
  headers.appendChild(document.createElement('th').appendChild(document.createTextNode('Url')).parentNode);
  headers.appendChild(document.createElement('th'));

  for (let i = urls.length - 1; i >= 0; i--) {
    const { route, url } = urls[i];
    table.appendChild(createRow(table, route, url, i));
  }

  return table;
}

async function start() {

  // Get the URLS.
  const urls = await fetchURL('GET', null, '/all');

  const addRowButton = document.createElement('button').appendChild(document.createTextNode('Add Route')).parentNode;
  addRowButton.className = 'btn btn-outline-success btn-sm my-3';
  document.body.appendChild(addRowButton);

  const table = createTable(urls);
  document.body.appendChild(table);

  addRowButton.addEventListener('mousedown', async () => {
    table.insertBefore(createRow(table, '/', '', table.children.length - 1), table.firstChild.nextSibling);
  });
}

start();