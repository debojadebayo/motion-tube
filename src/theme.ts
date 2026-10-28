import type {ThreadGenerator} from '@motion-canvas/core';

export const theme = {
  ink: '#141311',
  plate: '#1c1b18',
  paper: '#f4efe6',
  muted: '#b7b1a6',
  accent: '#ff4d2e',
  font: 'Outfit',
} as const;

export function* loadFonts(): ThreadGenerator {
  yield document.fonts.ready;
}
