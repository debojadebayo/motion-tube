import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutBack, useTime, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../../../shared/theme';

const duration = 11.5;
const orange = '#bd5b1c';
const teal = '#0f8c98';
const positions: [number, number][] = [
  [-650, 180], [-260, -80], [120, 40], [-80, -150], [-120, 200], [100, -230],
  [-760, -140], [-480, -220], [-430, 220], [-560, -20], [-320, -240], [-20, 260],
];
const target: [number, number] = [650, 0];
const doc57: [number, number] = [520, -230];
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
  const missed = createRef<Node>();
  const missedEdge = createRef<Line>();
  const detour = [createRef<Line>(), createRef<Line>()];
  const farther = createRef<Node>();
  const closer = createRef<Node>();
  const localMinimum = createRef<Node>();
  const neighborHighlight = createRef<Rect>();
  const doc43Highlight = createRef<Rect>();
  const betterConnection = createRef<Line>();
  const start = useTime();

  view.fill('#f5f5f5');
  yield* loadFonts();
  view.add(
    <>
      <Txt y={-430} text={'STUCK AT DOC 43'} fontFamily={theme.font} fontSize={78} fontWeight={800} fill={theme.ink} />
      <Line points={[[-80, -368], [80, -368]]} stroke={theme.accent} lineWidth={10} lineCap={'round'} />
      <Node ref={map} y={55}>
        <Rect x={12} y={14} width={1720} height={740} radius={36} fill={theme.ink} opacity={0.12} />
        <Rect width={1720} height={740} radius={36} fill={'#ffffff'} stroke={theme.ink} lineWidth={8} />
        {edges.map(([from, to]) => (
          <Line points={endpoints(positions[from], positions[to])} stroke={theme.ink} lineWidth={7} lineCap={'round'} />
        ))}
        <Line points={endpoints(positions[0], positions[1])} stroke={orange} lineWidth={13} lineCap={'round'} endArrow arrowSize={23} />
        <Line points={endpoints(positions[1], positions[2])} stroke={orange} lineWidth={13} lineCap={'round'} endArrow arrowSize={23} />
        <Line points={endpoints(positions[2], target)} stroke={orange} lineWidth={13} lineCap={'round'} />
        <Line ref={missedEdge} points={endpoints(positions[5], doc57)} stroke={theme.ink} lineWidth={7} lineCap={'round'} opacity={0} />
        <Line ref={detour[0]} points={endpoints(positions[2], positions[5])} stroke={teal} lineWidth={13} lineCap={'round'} endArrow arrowSize={23} end={0} />
        <Line ref={detour[1]} points={endpoints(positions[5], doc57)} stroke={teal} lineWidth={13} lineCap={'round'} endArrow arrowSize={23} end={0} />
        <Line ref={betterConnection} points={endpoints(doc57, target)} stroke={teal} lineWidth={13} lineCap={'round'} end={0} />
        {positions.map((position, index) => (
          <Node position={position}>
            <Rect x={7} y={9} width={144} height={104} radius={13} fill={theme.ink} opacity={0.14} />
            <Rect width={144} height={104} radius={13} fill={fills[index % fills.length]} stroke={theme.ink} lineWidth={6} />
            {index === 5 && <Rect ref={neighborHighlight} width={160} height={120} radius={18} stroke={teal} lineWidth={12} opacity={0} />}
            {index === 2 && <Rect ref={doc43Highlight} width={160} height={120} radius={18} stroke={orange} lineWidth={12} />}
            <Rect x={-38} y={-27} width={25} height={8} radius={4} fill={theme.accent} />
            <Line points={[[-18, -24], [42, -24]]} stroke={theme.ink} lineWidth={5} opacity={0.45} lineCap={'round'} />
            <Line points={[[-38, -8], [42, -8]]} stroke={theme.ink} lineWidth={5} opacity={0.35} lineCap={'round'} />
            <Txt y={26} text={index < 3 ? `DOC ${[2, 27, 43][index]}` : 'DOC'} fontFamily={theme.font} fontSize={index < 3 ? 26 : 29} fontWeight={700} fill={theme.ink} />
          </Node>
        ))}
        <Node ref={missed} position={doc57} opacity={0} scale={0.7}>
          <Rect x={7} y={9} width={144} height={104} radius={13} fill={theme.ink} opacity={0.14} />
          <Rect width={144} height={104} radius={13} fill={'#f6d78c'} stroke={theme.ink} lineWidth={6} />
          <Rect width={160} height={120} radius={18} stroke={teal} lineWidth={12} />
          <Rect x={-38} y={-27} width={25} height={8} radius={4} fill={theme.accent} />
          <Line points={[[-18, -24], [42, -24]]} stroke={theme.ink} lineWidth={5} opacity={0.45} lineCap={'round'} />
          <Line points={[[-38, -8], [42, -8]]} stroke={theme.ink} lineWidth={5} opacity={0.35} lineCap={'round'} />
          <Txt y={26} text={'DOC 57'} fontFamily={theme.font} fontSize={26} fontWeight={700} fill={theme.ink} />
        </Node>
        <Node position={target}>
          <Rect x={8} y={10} width={170} height={130} radius={20} fill={theme.ink} opacity={0.14} />
          <Rect width={170} height={130} radius={20} fill={'#ffffff'} stroke={orange} lineWidth={9} />
          <Rect y={-40} width={66} height={26} radius={7} fill={orange} />
          <Txt y={-40} text={'NEW'} fontFamily={theme.font} fontSize={17} fontWeight={800} fill={'#ffffff'} />
          <Txt y={16} text={'DOC 101'} fontFamily={theme.font} fontSize={31} fontWeight={800} fill={theme.ink} />
        </Node>
        <Node ref={farther} x={100} y={-325} opacity={0}>
          <Rect width={260} height={46} radius={13} fill={'#ffffff'} stroke={teal} lineWidth={5} />
          <Txt text={'FARTHER FIRST'} fontFamily={theme.font} fontSize={22} fontWeight={800} fill={theme.ink} />
        </Node>
        <Node ref={closer} x={560} y={-325} opacity={0}>
          <Rect width={265} height={46} radius={13} fill={'#ffffff'} stroke={teal} lineWidth={5} />
          <Txt text={'CLOSER MATCH'} fontFamily={theme.font} fontSize={22} fontWeight={800} fill={theme.ink} />
        </Node>
        <Node ref={localMinimum} x={420} y={315} opacity={0} scale={0.85}>
          <Rect x={9} y={10} width={560} height={88} radius={24} fill={theme.ink} opacity={0.13} />
          <Rect width={560} height={88} radius={24} fill={'#ffffff'} stroke={orange} lineWidth={8} />
          <Txt text={'LOCAL MINIMUM'} fontFamily={theme.font} fontSize={42} fontWeight={800} fill={theme.ink} />
        </Node>
      </Node>
    </>,
  );

  yield* waitFor(Math.max(0, 2 - (useTime() - start)));
  yield* all(missed().opacity(1, 0.35), missed().scale(1, 0.6, easeOutBack), missedEdge().opacity(1, 0.45), closer().opacity(1, 0.4));
  yield* waitFor(Math.max(0, 4.5 - (useTime() - start)));
  yield* all(detour[0]().end(1, 0.8, easeInOutCubic), neighborHighlight().opacity(1, 0.5), farther().opacity(1, 0.45));
  yield* waitFor(Math.max(0, 6.5 - (useTime() - start)));
  yield* detour[1]().end(1, 1, easeInOutCubic);
  yield* waitFor(Math.max(0, 8.5 - (useTime() - start)));
  yield* all(localMinimum().opacity(1, 0.35), localMinimum().scale(1, 0.55, easeOutBack), doc43Highlight().opacity(0.5, 0.4), betterConnection().end(1, 0.8, easeInOutCubic));
  yield* waitFor(Math.max(0, duration - (useTime() - start)));
});
