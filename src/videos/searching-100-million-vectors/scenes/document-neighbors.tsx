import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutCubic, useTime, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../../../shared/theme';

const duration = 13.5;
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
  return [
    [from[0] + dx * inset, from[1] + dy * inset],
    [to[0] - dx * inset, to[1] - dy * inset],
  ];
}

export default makeScene2D(function* (view) {
  const paper = createRef<Node>();
  const cards = positions.map(() => createRef<Node>());
  const links = neighbors.map(() => createRef<Line>());
  const start = useTime();

  view.fill('#f5f5f5');
  yield* loadFonts();
  view.add(
    <>
      <Txt y={-430} text={'DOCUMENTS'} fontFamily={theme.font} fontSize={78} fontWeight={800} fill={theme.ink} />
      <Line points={[[-80, -368], [80, -368]]} stroke={theme.accent} lineWidth={10} lineCap={'round'} />
      <Node ref={paper} y={35}>
        <Rect x={11} y={12} width={465} height={740} radius={24} fill={theme.ink} opacity={0.12} />
        <Rect width={465} height={740} radius={24} fill={'#ffffff'} stroke={theme.ink} lineWidth={8} />
      </Node>
      {neighbors.map(([from, to], index) => (
        <Line ref={links[index]} points={endpoints(positions[from], positions[to])} stroke={theme.ink} lineWidth={8} lineCap={'round'} end={0} />
      ))}
      {positions.map((position, index) => (
        <Node ref={cards[index]} position={[0, -283 + index * 63]} scale={0.55}>
          <Rect x={7} y={9} width={144} height={104} radius={13} fill={theme.ink} opacity={0.14} />
          <Rect width={144} height={104} radius={13} fill={fills[index % fills.length]} stroke={theme.ink} lineWidth={6} />
          <Rect x={-38} y={-27} width={25} height={8} radius={4} fill={theme.accent} />
          <Line points={[[-18, -24], [42, -24]]} stroke={theme.ink} lineWidth={5} opacity={0.45} lineCap={'round'} />
          <Line points={[[-38, -8], [42, -8]]} stroke={theme.ink} lineWidth={5} opacity={0.35} lineCap={'round'} />
          <Txt y={26} text={`DOC ${String(index + 1).padStart(2, '0')}`} fontFamily={theme.font} fontSize={26} fontWeight={700} fill={theme.ink} />
        </Node>
      ))}
    </>,
  );

  yield* waitFor(3);
  yield* all(
    paper().opacity(0, 0.5, easeOutCubic),
    ...cards.map((card, index) => all(
      card().position(positions[index], 2.7, easeInOutCubic),
      card().scale(1, 2.7, easeInOutCubic),
    )),
  );
  yield* waitFor(Math.max(0, 6.5 - (useTime() - start)));
  for (const [index, link] of links.entries()) {
    yield* waitFor(Math.max(0, 6.5 + index * 0.29 - (useTime() - start)));
    yield* link().end(1, 0.42, easeInOutCubic);
  }
  yield* waitFor(Math.max(0, duration - (useTime() - start)));
});
