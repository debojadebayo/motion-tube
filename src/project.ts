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
import friendshipRoute from './scenes/friendship-route?scene';
import documentNeighbors from './scenes/document-neighbors?scene';
import documentNeighborWalk from './scenes/document-neighbor-walk?scene';
import fiftyThousandDocumentSearch from './scenes/fifty-thousand-document-search?scene';
import brixtonEnfieldRestaurant from './scenes/brixton-enfield-restaurant?scene';
import document101DeadEnd from './scenes/document-101-dead-end?scene';
import document57LocalMinimum from './scenes/document-57-local-minimum?scene';
import hnswStackedFloors from './scenes/hnsw-stacked-floors?scene';
import hnswLinksByFloor from './scenes/hnsw-links-by-floor?scene';
import vectorSearchRecap from './scenes/vector-search-recap?scene';
import titleCard from './scenes/title-card?scene';
import wordsToEmbeddings from './scenes/words-to-embeddings?scene';

import '@fontsource/outfit/latin-500.css';
import '@fontsource/outfit/latin-600.css';
import '@fontsource/outfit/latin-700.css';
import '@fontsource/outfit/latin-800.css';

export default makeProject({
  scenes: [fortune500, ceoSpeech, beforeAfterLibrary, wordsToEmbeddings, mapCoordinates, semanticProximity, embeddingMatch, searchScale, linearWork, friendshipGroup, friendshipRoute, documentNeighbors, documentNeighborWalk, fiftyThousandDocumentSearch, brixtonEnfieldRestaurant, document101DeadEnd, document57LocalMinimum, hnswStackedFloors, hnswLinksByFloor, vectorSearchRecap, titleCard, lowerThird, callout],
});
