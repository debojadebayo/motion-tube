import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutBack, easeOutCubic, useTime, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

const duration = 35;
const orange = '#bd5b1c';
const teal = '#0f8c98';
const positions: [number, number][] = [
  [-650, 180], [-260, -80], [120, 40], [-80, -150], [-120, 200], [100, -230],
  [-760, -140], [-480, -220], [-430, 220], [-560, -20], [-320, -240], [-20, 260],
];
const target: [number, number] = [650, 0];
const edges: [number, number][] = [
  [0, 1], [0, 6], [0, 8], [0, 9], [1, 2], [1, 3], [1, 7], [1, 9], [1, 10],
  [2, 3], [2, 4], [2, 5], [3, 5], [3, 10], [4, 11], [7, 10], [8, 4], [6, 9],
];
const fills = ['#f6d78c', '#bcd9df', '#dac8ed', '#c5d9b6', '#f3b7a7'];

function endpoints(from: [number, number], to: [number, number]): [[number, number], [number, number]] {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const inset = Math.min(72 / Math.abs(dx || 1), 52 / Math.abs(dy || 1));
  return [[from[0] + dx * inset, from[1] + dy * inset], [to[0] - dx * inset, to[1] - dy * inset]];
}

export default makeScene2D(function* (view) {
  const map = createRef<Node>();
  const newDocument = createRef<Node>();
  const deadEnd = createRef<Node>();
  const insertedEdge = createRef<Line>();
  const baseLabels = positions.map(() => createRef<Txt>());
  const numberedLabels = [createRef<Txt>(), createRef<Txt>(), createRef<Txt>()];
  const active = positions.map(() => createRef<Rect>());
  const candidates = positions.map(() => createRef<Rect>());
  const steps = [createRef<Line>(), createRef<Line>()];
  const start = useTime();

  view.fill('#f5f5f5');
  yield* loadFonts();
  view.add(
    <>
      <Txt y={-430} text={'INSERT DOC 101'} fontFamily={theme.font} fontSize={78} fontWeight={800} fill={theme.ink} />
      <Line points={[[-80, -368], [80, -368]]} stroke={theme.accent} lineWidth={10} lineCap={'round'} />
      <Node ref={map} y={55} opacity={0} scale={0.97}>
        <Rect x={12} y={14} width={1720} height={740} radius={36} fill={theme.ink} opacity={0.12} />
        <Rect width={1720} height={740} radius={36} fill={'#ffffff'} stroke={theme.ink} lineWidth={8} />
        {edges.map(([from, to]) => (
          <Line points={endpoints(positions[from], positions[to])} stroke={theme.ink} lineWidth={7} lineCap={'round'} />
        ))}
        <Line ref={steps[0]} points={endpoints(positions[0], positions[1])} stroke={orange} lineWidth={13} lineCap={'round'} endArrow arrowSize={23} end={0} />
        <Line ref={steps[1]} points={endpoints(positions[1], positions[2])} stroke={orange} lineWidth={13} lineCap={'round'} endArrow arrowSize={23} end={0} />
        <Line ref={insertedEdge} points={endpoints(positions[2], target)} stroke={orange} lineWidth={13} lineCap={'round'} end={0} />
        {positions.map((position, index) => (
          <Node position={position}>
            <Rect x={7} y={9} width={144} height={104} radius={13} fill={theme.ink} opacity={0.14} />
            <Rect width={144} height={104} radius={13} fill={fills[index % fills.length]} stroke={theme.ink} lineWidth={6} />
            <Rect ref={candidates[index]} width={156} height={116} radius={17} stroke={teal} lineWidth={10} opacity={0} />
            <Rect ref={active[index]} width={160} height={120} radius={18} stroke={orange} lineWidth={12} opacity={0} />
            <Rect x={-38} y={-27} width={25} height={8} radius={4} fill={theme.accent} />
            <Line points={[[-18, -24], [42, -24]]} stroke={theme.ink} lineWidth={5} opacity={0.45} lineCap={'round'} />
            <Line points={[[-38, -8], [42, -8]]} stroke={theme.ink} lineWidth={5} opacity={0.35} lineCap={'round'} />
            <Txt ref={baseLabels[index]} y={26} text={'DOC'} fontFamily={theme.font} fontSize={29} fontWeight={700} fill={theme.ink} />
            {index < 3 && (
              <Txt ref={numberedLabels[index]} y={26} text={`DOC ${[2, 27, 43][index]}`} fontFamily={theme.font} fontSize={26} fontWeight={700} fill={theme.ink} opacity={0} />
            )}
          </Node>
        ))}
        <Node ref={newDocument} position={target} opacity={0} scale={0.65}>
          <Rect x={8} y={10} width={170} height={130} radius={20} fill={theme.ink} opacity={0.14} />
          <Rect width={170} height={130} radius={20} fill={'#ffffff'} stroke={orange} lineWidth={9} />
          <Rect y={-40} width={66} height={26} radius={7} fill={orange} />
          <Txt y={-40} text={'NEW'} fontFamily={theme.font} fontSize={17} fontWeight={800} fill={'#ffffff'} />
          <Txt y={16} text={'DOC 101'} fontFamily={theme.font} fontSize={31} fontWeight={800} fill={theme.ink} />
        </Node>
        <Node ref={deadEnd} x={420} y={315} opacity={0} scale={0.85}>
          <Rect x={9} y={10} width={600} height={88} radius={24} fill={theme.ink} opacity={0.13} />
          <Rect width={600} height={88} radius={24} fill={'#ffffff'} stroke={orange} lineWidth={8} />
          <Txt text={'CONNECTED TO DOC 43'} fontFamily={theme.font} fontSize={39} fontWeight={800} fill={theme.ink} />
        </Node>
      </Node>
    </>,
  );

  yield* all(map().opacity(1, 0.55), map().scale(1, 0.55, easeOutCubic));
  yield* waitFor(Math.max(0, 2 - (useTime() - start)));
  yield* all(newDocument().opacity(1, 0.35), newDocument().scale(1, 0.6, easeOutBack));
  yield* waitFor(Math.max(0, 7 - (useTime() - start)));
  yield* all(baseLabels[0]().opacity(0, 0.2), numberedLabels[0]().opacity(1, 0.2), active[0]().opacity(1, 0.3));
  yield* waitFor(Math.max(0, 10 - (useTime() - start)));
  yield* all(
    baseLabels[1]().opacity(0, 0.2), numberedLabels[1]().opacity(1, 0.2),
    active[0]().opacity(0, 0.3), active[1]().opacity(1, 0.3),
    steps[0]().end(1, 1.2, easeInOutCubic),
  );
  yield* waitFor(Math.max(0, 15 - (useTime() - start)));
  yield* all(...[0, 2, 3, 7, 9, 10].map(index => candidates[index]().opacity(0.8, 0.45)));
  yield* waitFor(Math.max(0, 18 - (useTime() - start)));
  yield* all(
    baseLabels[2]().opacity(0, 0.2), numberedLabels[2]().opacity(1, 0.2),
    active[1]().opacity(0, 0.3), active[2]().opacity(1, 0.3),
    ...[0, 2, 3, 7, 9, 10].map(index => candidates[index]().opacity(0, 0.3)),
    steps[1]().end(1, 1.2, easeInOutCubic),
  );
  yield* waitFor(Math.max(0, 22 - (useTime() - start)));
  yield* all(...[1, 3, 4, 5].map(index => candidates[index]().opacity(0.8, 0.55)));
  yield* waitFor(Math.max(0, 33 - (useTime() - start)));
  yield* insertedEdge().end(1, 0.85, easeInOutCubic);
  yield* all(deadEnd().opacity(1, 0.4), deadEnd().scale(1, 0.55, easeOutBack));
  yield* waitFor(Math.max(0, duration - (useTime() - start)));
});
