import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [videoSlug, sceneSlug, exportSlug = sceneSlug] = process.argv.slice(2).filter(value => value !== '--');
const validSlug = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
if (![videoSlug, sceneSlug, exportSlug].every(validSlug)) {
  console.error('Usage: pnpm render -- <video-slug> <scene-slug> [export-slug]');
  process.exit(1);
}

const videoDir = path.join(root, 'src', 'videos', videoSlug);
let video;
try {
  video = JSON.parse(await readFile(path.join(videoDir, 'video.json'), 'utf8'));
} catch {
  console.error(`Unknown video: ${videoSlug}`);
  process.exit(1);
}
const scene = video.renders?.[sceneSlug];
if (!scene) {
  console.error(`No command-line renderer for ${sceneSlug} in ${videoSlug}. Render this scene in the Motion Canvas editor, then publish its MP4 with scripts/publish-render.sh.`);
  process.exit(1);
}
const script = path.resolve(root, scene.script);
if (!script.startsWith(path.join(root, 'scripts') + path.sep) && !script.startsWith(videoDir + path.sep)) {
  throw new Error(`Renderer must be in scripts/ or this video's folder: ${scene.script}`);
}
const run = (command, args) => {
  const result = spawnSync(command, args, {cwd: root, stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status}`);
};
const staging = await mkdtemp(path.join(os.tmpdir(), 'motion-tube-render-'));
const file = path.join(staging, `${exportSlug}.mp4`);
try {
  run('bash', [script, file]);
  const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,avg_frame_rate,nb_frames:format=duration', '-of', 'json', file], {encoding: 'utf8'});
  if (probe.status !== 0) throw new Error('ffprobe could not read the rendered MP4');
  const {streams, format} = JSON.parse(probe.stdout);
  const stream = streams?.[0];
  const expectedFrames = Math.round(scene.seconds * 30);
  if (stream?.width !== 3840 || stream?.height !== 2160 || stream?.avg_frame_rate !== '30/1' || Math.abs(Number(stream.nb_frames) - expectedFrames) > 1 || Math.abs(Number(format.duration) - scene.seconds) > 1 / 30 + 0.001) {
    throw new Error(`Render differs from ${scene.seconds}s at 3840x2160/30fps: ${JSON.stringify({stream, duration: format.duration})}`);
  }
  run('bash', [path.join(root, 'scripts', 'publish-render.sh'), file, videoSlug, exportSlug]);
} finally {
  await rm(staging, {recursive: true, force: true});
}
