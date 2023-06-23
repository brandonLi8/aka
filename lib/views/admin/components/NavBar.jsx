// Copyright © 2021-2023 Brandon Li. All rights reserved.

/**
 * NavBar component
 *
 * @author Brandon Li <brandon.li@berkeley.edu>
 */

// modules
import {
  ColorModePreference,
  getColorModePreference,
  toggleColorMode,
  updateColorMode
} from '../dark-mode';

// constants
const COLOR_MODE_TO_LOGO = {
  [ColorModePreference.DARK]: '/admin/assets/aka-logo-dark.svg',
  [ColorModePreference.LIGHT]: '/admin/assets/aka-logo.svg',
};
const COLOR_MODE_TO_ICON = {
  [ColorModePreference.DARK]: 'fa-sun',
  [ColorModePreference.LIGHT]: 'fa-moon',
};

function NavBar() {
  // Color mode (dark-mode) functionality
  const [colorMode, setColorMode] = React.useState(getColorModePreference());
  updateColorMode(colorMode);

  // Shrink nav-bar on scroll.
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={'navbar bg-body px-5 sticky-top' + (scrolled ? ' shadow-sm' : '')}
      style={{
        height: scrolled ? '4em' : '6em',
        transition: 'height 250ms ease-in-out 0s, box-shadow 250ms ease-in-out 0s'
      }}
    >
      <div className='content d-flex align-items-center justify-content-between'>
        {/* logo */}
        <a class='navbar-brand' href='#'>
          <img src={COLOR_MODE_TO_LOGO[colorMode]} width='120rem' className='d-block'/>
        </a>

        {/* color mode toggle */}
        <button
          onClick={() => setColorMode(toggleColorMode(colorMode)) }
          className='btn btn-outline-secondary btn-sm'
        >
          <i className={`fa ${COLOR_MODE_TO_ICON[colorMode]}`} style={{ width: '17px' }}/>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
