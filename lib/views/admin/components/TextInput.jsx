// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * An editable TextInput component.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

import { CellStatus } from './Cell';

/**
 * @param {{
 *    value - value of the input
 *    onUpdate - called when input value is updated
 *    status - the status of the cell
 *    [prefix=''] - un-editable prefix displayed to the left of the input value
 *    [plaeholder=''] - placeholder text displayed when there is nothing in the input
 * }}
 */
export default function TextInput({
  value,
  onUpdate,
  status,
  prefix = '',
  placeholder = ''
}) {
  const [ focus, setFocus ] = React.useState(false);
  const inputRef = React.createRef();

  return (
    <div
      className='d-flex align-items-center w-100'
      title={status instanceof CellStatus.ERROR ? status.message : ''}
    >
      {/* Display the value input */}
      <span
        className={'py-1 rounded d-inline-block w-100' + (status instanceof CellStatus.ERROR ? ' text-danger' : '')}
        style={{ cursor: 'text',
          outline: focus ? '2px solid var(--bs-focus-ring-color)' : '',
          textDecoration: status instanceof CellStatus.ERROR ? 'underline wavy' : '' }}
        onClick={() => inputRef.current.focus()}
      >
        {prefix}
        <div
          contentEditable='true'
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
          onInput={({ target: { innerText } }) => onUpdate(innerText.trimEnd())}
          onPaste={e => {
            e.preventDefault();
            document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
          }}
          className={'p-0' + (prefix ? ' d-inline' : '')}
          ref={inputRef}
          data-placeholder={placeholder}
        >
          {value}
        </div>
      </span>

      {/* Display the status of the update */}
      <div style={{ width: '1.3rem' }} className='mx-2'>
        {status === CellStatus.UPDATING && <i className='align-baseline fa fa-spinner fa-spin text-secondary' />}
        {status === CellStatus.SUCCESS && <i className='align-baseline fa fa-check-circle text-success' />}
        {status instanceof CellStatus.ERROR && <i className='align-baseline fas fa-exclamation-circle text-danger'/>}
      </div>
    </div>
  );
}