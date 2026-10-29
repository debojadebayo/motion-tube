import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeOutBack, easeOutCubic, sequence, useTime, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

const duration = 7;
const columns = 14;
const rows = 5;
const burntOrange = '#bd5b1c';
const fills = ['#f6d78c', '#bcd9df', '#dac8ed', '#c5d9b6', '#f3b7a7'];
const points: [number, number][] = Array.from({length: columns * rows}, (_, index) => {
  const column = index % columns;
  const row = Math.floor(index / columns);
  return [-695 + column * 106 + Math.sin(index * 2.3) * 16, -255 + row * 112 + Math.sin(index * 1.7) * 16];
});
const routeRows = [2, 2, 1, 1, 2, 3, 2, 1, 2, 3, 3, 2, 2];
const route = routeRows.map((row, column) => row * columns + column);
const links: [number, number][] = [];
for (let row = 0; row < rows; row++) {
  for (let column = 0; column < columns; column++) {
    const index = row * columns + column;
    if (column < columns - 1) links.push([index, index + 1]);
    if (row < rows - 1 && (row + column) % 3 === 0) links.push([index, index + columns]);
  }
}
for (let index = 0; index < route.length - 1; index++) {
  const from = route[index];
  const to = route[index + 1];
  if (!links.some(([left, right]) => left === from && right === to)) links.push([from, to]);
}

export default makeScene2D(function* (view) {
  const question = createRef<Node>();
  const answer = createRef<Node>();
  const counter = createRef<Node>();
  const answerLink = createRef<Line>();
  const hopCount = createSignal(0);
  const routeLines = route.slice(0, -1).map(() => createRef<Line>());
  const start = useTime();

  view.fill('#f5f5f5');
  yield* loadFonts();
  view.add(
    <>
      <Txt y={-430} text={'50,000 DOCUMENTS'} fontFamily={theme.font} fontSize={78} fontWeight={800} fill={theme.ink} />
      <Line points={[[-80, -368], [80, -368]]} stroke={theme.accent} lineWidth={10} lineCap={'round'} />
      {links.map(([from, to]) => (
        <Line points={[points[from], points[to]]} stroke={theme.ink} lineWidth={3} opacity={0.23} lineCap={'round'} />
      ))}
      {routeLines.map((line, index) => (
        <Line ref={line} points={[points[route[index]], points[route[index + 1]]]} stroke={burntOrange} lineWidth={12} lineCap={'round'} end={0} />
      ))}
      <Line ref={answerLink} points={[points[route[route.length - 1]], [555, 201]]} stroke={burntOrange} lineWidth={12} lineCap={'round'} end={0} />
      {points.map((point, index) => (
        <Node position={point}>
          <Rect x={3} y={4} width={38} height={46} radius={6} fill={theme.ink} opacity={0.12} />
          <Rect width={38} height={46} radius={6} fill={fills[index % fills.length]} stroke={theme.ink} lineWidth={3} />
          <Line points={[[-9, -8], [9, -8]]} stroke={theme.ink} lineWidth={2} opacity={0.5} />
          <Line points={[[-9, 1], [5, 1]]} stroke={theme.ink} lineWidth={2} opacity={0.35} />
        </Node>
      ))}
      <Node ref={question} position={[-700, -290]} opacity={0} scale={0.75}>
        <Rect x={7} y={8} width={210} height={82} radius={22} fill={theme.ink} opacity={0.13} />
        <Rect width={210} height={82} radius={22} fill={'#ffffff'} stroke={burntOrange} lineWidth={7} />
        <Txt text={'QUESTION ?'} fontFamily={theme.font} fontSize={25} fontWeight={800} fill={theme.ink} />
      </Node>
      <Node ref={answer} position={[555, 245]} opacity={0} scale={0.75}>
        <Rect x={7} y={8} width={220} height={88} radius={22} fill={theme.ink} opacity={0.13} />
        <Rect width={220} height={88} radius={22} fill={'#ffffff'} stroke={burntOrange} lineWidth={8} />
        <Txt text={'ANSWER'} fontFamily={theme.font} fontSize={36} fontWeight={800} fill={theme.ink} />
      </Node>
      <Node ref={counter} y={395} opacity={0}>
        <Txt text={() => `≈${Math.round(hopCount())} JUMPS`} fontFamily={theme.font} fontSize={70} fontWeight={800} fill={burntOrange} />
      </Node>
    </>,
  );

  yield* waitFor(1.1);
  yield* all(question().opacity(1, 0.3), question().scale(1, 0.45, easeOutBack));
  yield* waitFor(Math.max(0, 2.1 - (useTime() - start)));
  yield* all(
    counter().opacity(1, 0.3),
    hopCount(900, 3.4, easeOutCubic),
    sequence(0.24, ...routeLines.map(line => line().end(1, 0.44, easeInOutCubic))),
  );
  yield* all(answerLink().end(1, 0.4, easeInOutCubic), answer().opacity(1, 0.3), answer().scale(1, 0.45, easeOutBack));
  yield* waitFor(Math.max(0, duration - (useTime() - start)));
});
