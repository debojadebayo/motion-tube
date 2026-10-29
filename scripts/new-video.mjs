import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv.slice(2).filter(value => value !== '--')[0];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: pnpm new:video -- <lowercase-video-slug>');
  process.exit(1);
}

const video = path.join(root, 'src', 'videos', slug);
try {
  await mkdir(video);
} catch (error) {
  if (error.code === 'EEXIST') {
    console.error(`Video already exists: ${video}`);
    process.exit(1);
  }
  throw error;
}
await Promise.all(['scenes', 'assets', 'renderers'].map(name => mkdir(path.join(video, name))));
await Promise.all(['scenes', 'assets', 'renderers'].map(name => writeFile(path.join(video, name, '.gitkeep'), '')));
await writeFile(path.join(video, 'project.ts'), `import {makeProject} from '@motion-canvas/core';\n\n// Add scenes here after their duration is agreed in Descript.\nexport default makeProject({scenes: []});\n`);
const settings = await readFile(path.join(root, 'templates', 'video', 'project.meta'));
await writeFile(path.join(video, 'project.meta'), settings);
await writeFile(path.join(video, 'video.json'), JSON.stringify({title: slug.replaceAll('-', ' '), renders: {}}, null, 2) + '\n');
console.log(video);
