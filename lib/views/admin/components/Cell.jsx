// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Cell component within Table.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

/**
 * @param {Object} props - Component props.
 * @param {string} props.value - The initial value of the cell.
 * @param {bool} props.live - Is the bookmark initially live
 * @param {function} props.onUpdate - Callback function called when the cell value is updated.
 * @param {string} [props.prefix=''] - The prefix to be displayed before the cell value.
 * @returns {JSX.Element} The rendered Cell component.
 */
export default function Cell({ value, live = true, onUpdate, prefix = '' }) {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [showCheckmark, setShowCheckmark] = React.useState(false);
  const [showError, setShowError] = React.useState(!live);
  const [focus, setFocus] = React.useState(false);
  const inputRef = React.createRef()

  /**
   * Debounced update function that waits for a specific time period before calling the onUpdate callback.
   */
  const debouncedUpdate = React.useCallback(
    _.debounce(async (newValue) => {
      const { success } = await onUpdate(newValue);

      // Update is over
      setIsUpdating(false);

      if (success) {
        // Show a check-mark that goes away
        setShowCheckmark(true)
        setTimeout(() => { setShowCheckmark(false); }, 1000);
      }
      else {
        // Show a error state
        setShowError(true);
      }

    }, 1000),
    [onUpdate]
  );

  /**
   * Handles changes in the input field.
   */
  const handleChange = ({ target: { innerText }}) => {
    // indicate update state
    setIsUpdating(true);
    setShowError(false);
    setShowCheckmark(false);
    debouncedUpdate(innerText.trimEnd());
  };

  return (
    <td valign='middle'>
      <div className='d-flex align-items-center'>
        {/* Display the value input */}
        <span
          className={'py-1 rounded d-inline-block w-100' + (showError ? ' text-danger' : '')}
          style={{ cursor: 'text', outline: focus ? '2px solid var(--bs-focus-ring-color)' : ''}}
          onClick={() => inputRef.current.focus()}
        >
          {prefix}
          <div
            contentEditable='true'
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
            onInput={handleChange}
            className={'p-0' + (prefix ? ' d-inline' : '')}
            ref={inputRef}
          >
              {value}
          </div>
        </span>

        {/* Display the status of the update */}
        <div style={{ width: '1rem' }} className='mx-2'>
          {isUpdating && <i className='align-baseline fa fa-spinner fa-spin text-secondary' />}
          {showCheckmark && <i className='align-baseline fa fa-check-circle text-success' />}
          {showError && <i className='align-baseline fa fa-times-circle text-danger' />}
        </div>
      </div>
    </td>
  );
}
