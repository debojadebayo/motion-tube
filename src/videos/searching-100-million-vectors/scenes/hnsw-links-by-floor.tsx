import {Circle, Line, Node, Rect, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutBack, useTime, waitFor} from '@motion-canvas/core';

import {theme} from '../../../shared/theme';

const duration = 23;
const orange = '#bd5b1c';
const teal = '#0f8c98';
const fills = ['#f6d78c', '#bcd9df', '#dac8ed', '#c5d9b6', '#f3b7a7'];
const heights = [3, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0];
const localX = [-80, -25, 30, 85];
const localY = [-17, 22, -12, 20];
const x = (index: number) => [-550, 0, 550][Math.floor(index / 4)] + localX[index % 4];
const y = (index: number) => localY[index % 4];
const docs = (level: number) => heights.flatMap((height, index) => height >= level ? [index] : []);

function edges(level: number): [number, number][] {
  if (level === 0) {
    const clusterEdges: [number, number][] = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3]];
    return [0, 4, 8].flatMap(start => clusterEdges.map(([from, to]) => [start + from, start + to] as [number, number])).concat([[3, 4], [7, 8]]);
  }
  const selected = docs(level);
  return selected.slice(1).map((index, position) => [selected[position], index]);
}

function floor(level: number, background: string, showEdges = true) {
  return (
    <>
      <Rect x={9} y={10} width={1640} height={150} radius={28} fill={theme.ink} opacity={0.12} />
      <Rect width={1640} height={150} radius={28} fill={background} stroke={theme.ink} lineWidth={7} />
      {level === 0 && [0, 1, 2].map(group => (
        <Rect x={[-550, 0, 550][group]} y={10} width={250} height={100} radius={36} fill={fills[group]} opacity={0.24} />
      ))}
      {showEdges && edges(level).map(([from, to]) => (
        <Line points={[[x(from), y(from)], [x(to), y(to)]]} stroke={level === 0 ? '#b7b1a6' : teal} lineWidth={level === 0 ? 5 : 8} lineCap={'round'} />
      ))}
      {docs(level).map(index => (
        <Node x={x(index)} y={y(index)}>
          <Circle x={4} y={5} size={58} fill={theme.ink} opacity={0.14} />
          <Circle size={58} fill={fills[index % fills.length]} stroke={theme.ink} lineWidth={5} />
        </Node>
      ))}
    </>
  );
}

export default makeScene2D(function* (view) {
  const base = createRef<Node>();
  const baseEdges = createRef<Node>();
  const levelOne = createRef<Node>();
  const levelTwo = createRef<Node>();
  const levelThree = createRef<Node>();
  const stemsOne = createRef<Node>();
  const stemsTwo = createRef<Node>();
  const stemsThree = createRef<Node>();
  const start = useTime();

  view.fill('#f5f5f5');
  view.add(
    <>
      <Node ref={stemsThree} opacity={0}>
        {docs(3).map(index => <Line points={[[x(index), -245], [x(index), -185]]} stroke={orange} lineWidth={5} lineDash={[12, 9]} />)}
      </Node>
      <Node ref={stemsTwo} opacity={0}>
        {docs(2).map(index => <Line points={[[x(index), -30], [x(index), 30]]} stroke={orange} lineWidth={5} lineDash={[12, 9]} />)}
      </Node>
      <Node ref={stemsOne} opacity={0}>
        {docs(1).map(index => <Line points={[[x(index), 185], [x(index), 245]]} stroke={orange} lineWidth={5} lineDash={[12, 9]} />)}
      </Node>
      <Node ref={levelThree} y={-325} opacity={0} scale={0.96}>{floor(3, '#fff7ed')}</Node>
      <Node ref={levelTwo} y={-110} opacity={0} scale={0.96}>{floor(2, '#fffaf1')}</Node>
      <Node ref={levelOne} y={105} opacity={0} scale={0.96}>{floor(1, '#f5fbfb')}</Node>
      <Node ref={base} y={0} opacity={0}>
        <Rect x={9} y={10} width={1640} height={150} radius={28} fill={theme.ink} opacity={0.12} />
        <Rect width={1640} height={150} radius={28} fill={'#ffffff'} stroke={theme.ink} lineWidth={7} />
        {[0, 1, 2].map(group => <Rect x={[-550, 0, 550][group]} y={10} width={250} height={100} radius={36} fill={fills[group]} opacity={0.24} />)}
        <Node ref={baseEdges} opacity={0}>
          {edges(0).map(([from, to], index) => <Line points={[[x(from), y(from)], [x(to), y(to)]]} stroke={index < 15 ? orange : '#b7b1a6'} lineWidth={index < 15 ? 6 : 4} lineCap={'round'} />)}
        </Node>
        {docs(0).map(index => (
          <Node x={x(index)} y={y(index)}>
            <Circle x={4} y={5} size={58} fill={theme.ink} opacity={0.14} />
            <Circle size={58} fill={fills[index % fills.length]} stroke={theme.ink} lineWidth={5} />
          </Node>
        ))}
      </Node>
    </>,
  );

  yield* base().opacity(1, 0.5);
  yield* waitFor(Math.max(0, 3 - (useTime() - start)));
  yield* baseEdges().opacity(1, 1.2);
  yield* waitFor(Math.max(0, 11 - (useTime() - start)));
  yield* all(base().y(320, 0.4, easeInOutCubic), levelOne().opacity(1, 0.8), levelOne().scale(1, 0.8, easeOutBack), stemsOne().opacity(1, 0.8));
  yield* waitFor(Math.max(0, 18 - (useTime() - start)));
  yield* all(levelTwo().opacity(1, 0.7), levelTwo().scale(1, 0.7, easeOutBack), stemsTwo().opacity(1, 0.7));
  yield* waitFor(Math.max(0, 21 - (useTime() - start)));
  yield* all(levelThree().opacity(1, 0.55), levelThree().scale(1, 0.55, easeOutBack), stemsThree().opacity(1, 0.55));
  yield* waitFor(Math.max(0, duration - (useTime() - start)));
});
