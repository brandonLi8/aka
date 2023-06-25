// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * A Cell in the table.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

export const CellStatus = {
  NORMAL: 'normal',
  UPDATING: 'updating',
  SUCCESS: 'success',
  ERROR: class CellError { constructor(message) { this.message = message; } }
};

/**
 * @param {{
 *    onUpdate: update function that is throttled, and passed to children via render prop pattern
 *    initialStatus=CellStatus.NORMAL: the initial status of the cell
 * }}
 */
export default function Cell({ onUpdate, initialStatus=CellStatus.NORMAL, children }) {

  // The status of the Cell. This status is shared with its children via render prop pattern.
  const [ status, setStatus ] = React.useState(initialStatus);

  /**
   * Throttled update function that waits for a specific time period before calling the onUpdate callback.
   */
  const throttledUpdate = React.useCallback(
    _.throttle(async (data) => {

      const result = await onUpdate(data);

      if (result.success) {

        // Set status to success, and after a second change it to normal
        setStatus(CellStatus.SUCCESS);
        setTimeout(() => setStatus(CellStatus.NORMAL), 1000);
      }
      else {

        // Show a error status
        setStatus(new CellStatus.ERROR(result.error));
      }

    }, 700),
    [ onUpdate ]
  );

  const handleChildUpdate = data => {
    setStatus(CellStatus.UPDATING);
    throttledUpdate(data);
  };

  return (
    <td valign='middle'>
      { children(status, handleChildUpdate) }
    </td>
  );
}