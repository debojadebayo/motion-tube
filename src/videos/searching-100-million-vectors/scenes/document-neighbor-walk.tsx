import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, useTime, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../../../shared/theme';

const duration = 11.5;
const orange = '#bd5b1c';
const candidateColor = '#0f8c98';
const positions: [number, number][] = [
  [-685, -200], [-455, -250], [-260, -110], [-590, 70], [-160, 190],
  [-5, -205], [155, 15], [375, -180], [580, 70], [260, 260],
];
const neighbors: [number, number][] = [
  [0, 1], [0, 3], [1, 2], [2, 3], [2, 4], [2, 5], [3, 4],
  [4, 6], [5, 6], [5, 7], [6, 7], [6, 9], [7, 8], [8, 9],
];
const fills = ['#f6d78c', '#bcd9df', '#dac8ed', '#c5d9b6', '#f3b7a7'];

function endpoints(from: [number, number], to: [number, number]): [[number, number], [number, number]] {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const inset = Math.min(72 / Math.abs(dx || 1), 52 / Math.abs(dy || 1));
  return [[from[0] + dx * inset, from[1] + dy * inset], [to[0] - dx * inset, to[1] - dy * inset]];
}

export default makeScene2D(function* (view) {
  const candidates = positions.map(() => createRef<Rect>());
  const active = positions.map(() => createRef<Rect>());
  const steps = [createRef<Line>(), createRef<Line>()];
  const start = useTime();
  const first = positions[2];
  const second = positions[4];
  const third = positions[6];

  view.fill('#f5f5f5');
  yield* loadFonts();
  view.add(
    <>
      <Txt y={-430} text={'DOCUMENTS'} fontFamily={theme.font} fontSize={78} fontWeight={800} fill={theme.ink} />
      <Line points={[[-80, -368], [80, -368]]} stroke={theme.accent} lineWidth={10} lineCap={'round'} />
      {neighbors.map(([from, to]) => (
        <Line points={endpoints(positions[from], positions[to])} stroke={theme.ink} lineWidth={8} lineCap={'round'} />
      ))}
      <Line ref={steps[0]} points={endpoints(first, second)} stroke={orange} lineWidth={14} lineCap={'round'} endArrow arrowSize={24} end={0} />
      <Line ref={steps[1]} points={endpoints(second, third)} stroke={orange} lineWidth={14} lineCap={'round'} endArrow arrowSize={24} end={0} />
      {positions.map((position, index) => (
        <Node position={position}>
          <Rect x={7} y={9} width={144} height={104} radius={13} fill={theme.ink} opacity={0.14} />
          <Rect width={144} height={104} radius={13} fill={fills[index % fills.length]} stroke={theme.ink} lineWidth={6} />
          <Rect ref={candidates[index]} width={156} height={116} radius={17} stroke={candidateColor} lineWidth={10} opacity={0} />
          <Rect ref={active[index]} width={160} height={120} radius={18} stroke={orange} lineWidth={12} opacity={index === 2 ? 1 : 0} />
          <Rect x={-38} y={-27} width={25} height={8} radius={4} fill={theme.accent} />
          <Line points={[[-18, -24], [42, -24]]} stroke={theme.ink} lineWidth={5} opacity={0.45} lineCap={'round'} />
          <Line points={[[-38, -8], [42, -8]]} stroke={theme.ink} lineWidth={5} opacity={0.35} lineCap={'round'} />
          <Txt y={26} text={`DOC ${String(index + 1).padStart(2, '0')}`} fontFamily={theme.font} fontSize={26} fontWeight={700} fill={theme.ink} />
        </Node>
      ))}
      <Node position={[690, 410]}>
        <Rect x={6} y={7} width={170} height={112} radius={25} fill={theme.ink} opacity={0.13} />
        <Rect width={170} height={112} radius={25} fill={'#ffffff'} stroke={orange} lineWidth={8} />
        <Txt y={-13} text={'?'} fontFamily={theme.font} fontSize={55} fontWeight={800} fill={orange} />
        <Txt y={31} text={'QUESTION'} fontFamily={theme.font} fontSize={20} fontWeight={700} fill={theme.ink} />
      </Node>
    </>,
  );

  yield* waitFor(0.8);
  yield* all(...[1, 3, 4, 5].map(index => candidates[index]().opacity(1, 0.35)));
  yield* waitFor(Math.max(0, 2.5 - (useTime() - start)));
  yield* all(...[1, 3, 5].map(index => candidates[index]().opacity(0, 0.35)));
  yield* waitFor(Math.max(0, 4 - (useTime() - start)));
  yield* steps[0]().end(1, 1.1, easeInOutCubic);
  yield* all(active[2]().opacity(0, 0.2), candidates[4]().opacity(0, 0.2), active[4]().opacity(1, 0.2));
  yield* waitFor(Math.max(0, 7 - (useTime() - start)));
  yield* all(...[2, 3, 6].map(index => candidates[index]().opacity(1, 0.35)));
  yield* waitFor(Math.max(0, 8.5 - (useTime() - start)));
  yield* all(candidates[2]().opacity(0, 0.35), candidates[3]().opacity(0, 0.35));
  yield* waitFor(Math.max(0, 9.5 - (useTime() - start)));
  yield* steps[1]().end(1, 1.1, easeInOutCubic);
  yield* all(active[4]().opacity(0, 0.2), candidates[6]().opacity(0, 0.2), active[6]().opacity(1, 0.2));
  yield* waitFor(Math.max(0, duration - (useTime() - start)));
});
