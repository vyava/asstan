import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowDown,
  faBars,
  faCog,
  faHome,
  faMap,
  faSearch,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faCartArrowDown,
  faFileExcel,
  faArrowRightArrowLeft
} from '@fortawesome/free-solid-svg-icons';

// Tell Font Awesome to skip adding the CSS automatically since it's being imported
config.autoAddCss = false;

// List of used icons - amend if new icons are needed
library.add(
  fab,
  faBars,
  faHome,
  faSearch,
  faMap,
  faCog,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faCartArrowDown,
  faArrowDown,
  faFileExcel,
  faArrowRightArrowLeft
);