import {Circle, Line, Node, Rect, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutBack, useTime, waitFor} from '@motion-canvas/core';

import {theme} from '../../../shared/theme';

const duration = 21;
const orange = '#bd5b1c';
const teal = '#0f8c98';
const heights = [0, 1, 0, 2, 1, 0, 1, 0, 2, 0, 1, 0];
const offsets = [-35, 21, -40, 25, -33, 19, -37, 27, -42, 22, -36, 26];
const colors = ['#f6d78c', '#bcd9df', '#dac8ed', '#c5d9b6', '#f3b7a7'];
const x = (index: number) => -650 + Math.floor(index / 2) * 260;
const onFloor = (level: number) => heights.flatMap((height, index) => height >= level ? [index] : []);

function graphEdges(level: number) {
  const docs = onFloor(level);
  const adjacent = docs.slice(1).map((index, position) => [docs[position], index] as const);
  const shortcuts: [number, number][] = level === 0 ? [[0, 2], [2, 5], [4, 7], [7, 10]] : [];
  return [...adjacent, ...shortcuts];
}

function floor(level: number, panel: string) {
  const docs = onFloor(level);
  return (
    <>
      <Rect x={9} y={10} width={1640} height={180} radius={30} fill={theme.ink} opacity={0.12} />
      <Rect width={1640} height={180} radius={30} fill={panel} stroke={theme.ink} lineWidth={7} />
      {graphEdges(level).map(([from, to]) => (
        <Line points={[[x(from), 20 + offsets[from]], [x(to), 20 + offsets[to]]]} stroke={level === 0 ? '#b7b1a6' : teal} lineWidth={level === 0 ? 5 : 7} lineCap={'round'} />
      ))}
      {docs.map(index => (
        <Node x={x(index)} y={20 + offsets[index]}>
          <Circle x={5} y={6} size={70} fill={theme.ink} opacity={0.15} />
          <Circle size={70} fill={colors[index % colors.length]} stroke={theme.ink} lineWidth={5} />
        </Node>
      ))}
    </>
  );
}

export default makeScene2D(function* (view) {
  const base = createRef<Node>();
  const middle = createRef<Node>();
  const top = createRef<Node>();
  const stemsOne = createRef<Node>();
  const stemsTwo = createRef<Node>();
  const start = useTime();

  view.fill('#f5f5f5');
  view.add(
    <>
      <Node ref={stemsTwo} opacity={0}>
        {onFloor(2).map(index => <Line points={[[x(index), -210], [x(index), -80]]} stroke={orange} lineWidth={5} lineDash={[12, 9]} />)}
      </Node>
      <Node ref={stemsOne} opacity={0}>
        {onFloor(1).map(index => <Line points={[[x(index), 50], [x(index), 180]]} stroke={orange} lineWidth={5} lineDash={[12, 9]} />)}
      </Node>
      <Node ref={top} y={-270} opacity={0} scale={0.96}>{floor(2, '#fffaf1')}</Node>
      <Node ref={middle} y={-10} opacity={0} scale={0.96}>{floor(1, '#f5fbfb')}</Node>
      <Node ref={base} y={-10} opacity={0}>
        <Rect x={9} y={10} width={1640} height={180} radius={30} fill={theme.ink} opacity={0.12} />
        <Rect width={1640} height={180} radius={30} fill={'#ffffff'} stroke={theme.ink} lineWidth={7} />
        {graphEdges(0).map(([from, to]) => <Line points={[[x(from), 20 + offsets[from]], [x(to), 20 + offsets[to]]]} stroke={'#b7b1a6'} lineWidth={5} lineCap={'round'} />)}
        {onFloor(0).map(index => (
          <Node x={x(index)} y={20 + offsets[index]}>
            <Circle x={5} y={6} size={70} fill={theme.ink} opacity={0.15} />
            <Circle size={70} fill={colors[index % colors.length]} stroke={theme.ink} lineWidth={5} />
          </Node>
        ))}
      </Node>
    </>,
  );

  yield* base().opacity(1, 0.55);
  yield* waitFor(Math.max(0, 8 - (useTime() - start)));
  yield* base().y(250, 1, easeInOutCubic);
  yield* waitFor(Math.max(0, 14 - (useTime() - start)));
  yield* all(middle().opacity(1, 0.7), middle().scale(1, 0.7, easeOutBack), stemsOne().opacity(1, 0.7));
  yield* waitFor(Math.max(0, 17 - (useTime() - start)));
  yield* all(top().opacity(1, 0.7), top().scale(1, 0.7, easeOutBack), stemsTwo().opacity(1, 0.7));
  yield* waitFor(Math.max(0, duration - (useTime() - start)));
});
