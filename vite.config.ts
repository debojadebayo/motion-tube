import ffmpeg from '@motion-canvas/ffmpeg';
import motionCanvas from '@motion-canvas/vite-plugin';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
  server: {
    host: '0.0.0.0',
    port: 9473,
    strictPort: true,
  },
});
