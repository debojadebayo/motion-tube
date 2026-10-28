import {makeProject} from '@motion-canvas/core';

import callout from './scenes/callout?scene';
import lowerThird from './scenes/lower-third?scene';
import titleCard from './scenes/title-card?scene';

import '@fontsource/outfit/latin-500.css';
import '@fontsource/outfit/latin-600.css';
import '@fontsource/outfit/latin-700.css';
import '@fontsource/outfit/latin-800.css';

export default makeProject({
  scenes: [titleCard, lowerThird, callout],
});
