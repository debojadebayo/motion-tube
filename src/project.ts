import {makeProject} from '@motion-canvas/core';

import callout from './scenes/callout?scene';
import beforeAfterLibrary from './scenes/before-after-library?scene';
import ceoSpeech from './scenes/ceo-speech?scene';
import fortune500 from './scenes/fortune-500?scene';
import lowerThird from './scenes/lower-third?scene';
import mapCoordinates from './scenes/map-coordinates?scene';
import semanticProximity from './scenes/semantic-proximity?scene';
import embeddingMatch from './scenes/embedding-match?scene';
import searchScale from './scenes/search-scale?scene';
import linearWork from './scenes/linear-work?scene';
import friendshipGroup from './scenes/friendship-group?scene';
import titleCard from './scenes/title-card?scene';
import wordsToEmbeddings from './scenes/words-to-embeddings?scene';

import '@fontsource/outfit/latin-500.css';
import '@fontsource/outfit/latin-600.css';
import '@fontsource/outfit/latin-700.css';
import '@fontsource/outfit/latin-800.css';

export default makeProject({
  scenes: [fortune500, ceoSpeech, beforeAfterLibrary, wordsToEmbeddings, mapCoordinates, semanticProximity, embeddingMatch, searchScale, linearWork, friendshipGroup, titleCard, lowerThird, callout],
});
