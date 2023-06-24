// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * Drop-down component.
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

/**
 * @param {{
 *    options: string[] - the different options to display in the drop-down
 *    value: string - the initial value of the drop-down
 *    onUpdate - called when value is updated
 *    title - hover title
 * }}
 */
export default function Dropdown({ options, value, onUpdate, title }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState(value);

  // Handler for option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onUpdate(option);
    setIsOpen(false);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Ref for dropdown container
  const dropdownRef = React.useRef(null);

  // Event listener for handling clicks outside the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      className='dropdown me-2'
      ref={dropdownRef}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <div
        className='dropdown-toggle py-0 px-2 rounded-3'
        onClick={toggleDropdown}
        title={title}
        style={{
          backgroundColor: 'var(--bs-border-color)',
          cursor: 'pointer',
        }}
      >
        {selectedOption}
      </div>
      {isOpen && (
        <div
          className='dropdown-menu'
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            zIndex: '1',
            display: 'initial',
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              className='dropdown-item'
              onClick={() => handleOptionSelect(option)}
              style={{
                cursor: 'pointer',
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}