// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * An editable TextInput component.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

/**
 * @param {{
 *    value - initial value of the input
 *    onUpdate - called when input value is updated
 *    is_valid - indicates the value of the input valid. if not shows error state
 *    [prefix=''] - un-editable prefix displayed to the left of the input value
 * }}
 */
export default function TextInput({ value, onUpdate, is_valid = true, prefix = '', children }) {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [showCheckmark, setShowCheckmark] = React.useState(false);
  const [showError, setShowError] = React.useState(!is_valid);
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
    <div className='d-flex align-items-center'>
      { children }

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
          onPaste={e => {
            e.preventDefault();
            document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
          }}
          className={'p-0' + (prefix ? ' d-inline' : '')}
          ref={inputRef}
        >
          {value}
        </div>
      </span>

      {/* Display the status of the update */}
      <div style={{ width: '1.3rem' }} className='mx-2'>
        {isUpdating && <i className='align-baseline fa fa-spinner fa-spin text-secondary' />}
        {showCheckmark && <i className='align-baseline fa fa-check-circle text-success' />}
        {showError && <i className='align-baseline fas fa-exclamation-circle text-danger' />}
      </div>
    </div>
  );
}
