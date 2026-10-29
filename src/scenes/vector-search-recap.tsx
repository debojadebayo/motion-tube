import {Video, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

const embeddings = new URL('../../output/words-to-embeddings.mp4', import.meta.url).href;
const documentGraph = new URL('../../output/document-neighbors.mp4', import.meta.url).href;
const stackedGraphs = new URL('../../output/hnsw-stacked-floors-v3.mp4', import.meta.url).href;

export default makeScene2D(function* (view) {
  const first = createRef<Video>();
  const second = createRef<Video>();
  const third = createRef<Video>();

  view.fill('#f5f5f5');
  view.add(
    <>
      <Video ref={first} src={embeddings} width={1920} height={1080} />
      <Video ref={second} src={documentGraph} width={1920} height={1080} playbackRate={405 / 240} opacity={0} />
      <Video ref={third} src={stackedGraphs} width={1920} height={1080} playbackRate={390 / 285} time={8} opacity={0} />
    </>,
  );

  first().play();
  yield* waitFor(7.5);
  first().pause();
  first().opacity(0);
  second().opacity(1);
  second().play();
  yield* waitFor(8);
  second().pause();
  second().opacity(0);
  third().opacity(1);
  third().play();
  yield* waitFor(9.5);
});
