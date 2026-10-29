import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeOutBack, easeOutCubic, useTime, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

const duration = 10;
const burntOrange = '#bd5b1c';
const roads: [number, number][][] = [
  [[-730, -245], [-480, -150], [-210, -205], [90, -110], [360, -165], [700, -75]],
  [[-700, 215], [-440, 120], [-150, 175], [140, 95], [430, 155], [710, 80]],
  [[-570, -295], [-455, -45], [-325, 265]],
  [[-20, -285], [55, -65], [120, 275]],
  [[520, -290], [405, -15], [570, 280]],
];
const blocks: [number, number, number, number, string][] = [
  [-590, -85, 145, 80, '#e5caa7'], [-170, -255, 180, 85, '#c5d9b6'],
  [180, -275, 155, 90, '#dac8ed'], [620, -115, 120, 85, '#f6d78c'],
  [-670, 100, 125, 85, '#dac8ed'], [-190, 240, 170, 85, '#f3b7a7'],
  [230, 230, 160, 90, '#bcd9df'], [680, 215, 115, 85, '#c5d9b6'],
];

export default makeScene2D(function* (view) {
  const map = createRef<Node>();
  const brixton = createRef<Node>();
  const enfield = createRef<Node>();
  const message = createRef<Node>();
  const brixtonHalo = createRef<Circle>();
  const enfieldHalo = createRef<Circle>();
  const compass = createRef<Node>();
  const start = useTime();

  view.fill('#f5f5f5');
  yield* loadFonts();
  view.add(
    <>
      <Txt y={-430} text={'LONDON'} fontFamily={theme.font} fontSize={78} fontWeight={800} fill={theme.ink} />
      <Line points={[[-80, -368], [80, -368]]} stroke={theme.accent} lineWidth={10} lineCap={'round'} />
      <Node ref={map} y={55} opacity={0} scale={0.96}>
        <Rect x={12} y={14} width={1640} height={790} radius={36} fill={theme.ink} opacity={0.12} />
        <Rect width={1640} height={790} radius={36} fill={'#ffffff'} stroke={theme.ink} lineWidth={8} />
        {blocks.map(([x, y, width, height, fill]) => (
          <Rect x={x} y={y} width={width} height={height} radius={22} fill={fill} opacity={0.42} />
        ))}
        {roads.map(points => (
          <Line points={points} stroke={theme.ink} lineWidth={8} opacity={0.12} lineCap={'round'} lineJoin={'round'} />
        ))}
        <Line points={[[-740, 20], [-510, -5], [-280, 40], [-40, 15], [190, 55], [430, 20], [720, 45]]} stroke={'#bcd9df'} lineWidth={48} opacity={0.75} lineCap={'round'} lineJoin={'round'} />
        <Node ref={compass} x={690} y={-285} opacity={0}>
          <Txt y={-30} text={'N'} fontFamily={theme.font} fontSize={34} fontWeight={800} fill={theme.ink} />
          <Line points={[[0, 12], [0, -8]]} stroke={burntOrange} lineWidth={8} endArrow arrowSize={18} />
        </Node>
        <Node ref={brixton} x={-380} y={210} opacity={0} scale={0.6}>
          <Circle ref={brixtonHalo} size={150} stroke={theme.accent} lineWidth={8} opacity={0} />
          <Circle x={6} y={8} size={92} fill={theme.ink} opacity={0.14} />
          <Circle size={92} fill={theme.accent} stroke={theme.ink} lineWidth={7} />
          <Circle size={18} fill={'#ffffff'} />
          <Rect x={8} y={103} width={430} height={94} radius={22} fill={theme.ink} opacity={0.13} />
          <Rect y={95} width={430} height={94} radius={22} fill={'#ffffff'} stroke={theme.ink} lineWidth={7} />
          <Txt y={80} text={'BRIXTON'} fontFamily={theme.font} fontSize={48} fontWeight={800} fill={theme.ink} />
          <Txt y={115} text={'YOU ARE HERE'} fontFamily={theme.font} fontSize={21} fontWeight={700} fill={theme.accent} />
        </Node>
        <Node ref={enfield} x={430} y={-260} opacity={0} scale={0.6}>
          <Circle ref={enfieldHalo} size={150} stroke={burntOrange} lineWidth={8} opacity={0} />
          <Circle x={6} y={8} size={92} fill={theme.ink} opacity={0.14} />
          <Circle size={92} fill={burntOrange} stroke={theme.ink} lineWidth={7} />
          <Rect y={6} width={45} height={29} radius={5} fill={'#ffffff'} />
          <Rect y={-14} width={52} height={13} radius={4} fill={'#ffffff'} />
          <Rect x={8} y={103} width={450} height={94} radius={22} fill={theme.ink} opacity={0.13} />
          <Rect y={95} width={450} height={94} radius={22} fill={'#ffffff'} stroke={theme.ink} lineWidth={7} />
          <Txt y={79} text={'ENFIELD'} fontFamily={theme.font} fontSize={48} fontWeight={800} fill={theme.ink} />
          <Txt y={115} text={'NIGERIAN RESTAURANT'} fontFamily={theme.font} fontSize={21} fontWeight={700} fill={burntOrange} />
        </Node>
      </Node>
      <Node ref={message} x={-370} y={-220} opacity={0} scale={0.85}>
        <Rect x={10} y={12} width={680} height={170} radius={30} fill={theme.ink} opacity={0.13} />
        <Rect width={680} height={170} radius={30} fill={'#ffffff'} stroke={theme.ink} lineWidth={8} />
        <Rect x={-245} y={-56} width={122} height={34} radius={10} fill={theme.accent} />
        <Txt x={-245} y={-56} text={'MATE'} fontFamily={theme.font} fontSize={21} fontWeight={800} fill={'#ffffff'} />
        <Txt y={-7} text={'Best Nigerian restaurant'} fontFamily={theme.font} fontSize={41} fontWeight={700} fill={theme.ink} />
        <Txt y={45} text={'in town!'} fontFamily={theme.font} fontSize={41} fontWeight={700} fill={theme.ink} />
      </Node>
    </>,
  );

  yield* all(map().opacity(1, 0.55), map().scale(1, 0.55, easeOutCubic));
  yield* waitFor(Math.max(0, 0.65 - (useTime() - start)));
  yield* all(brixton().opacity(1, 0.3), brixton().scale(1, 0.55, easeOutBack));
  yield* waitFor(Math.max(0, 1.25 - (useTime() - start)));
  yield* all(message().opacity(1, 0.3), message().scale(1, 0.5, easeOutBack));
  yield* waitFor(Math.max(0, 3.6 - (useTime() - start)));
  yield* message().opacity(0, 0.35);
  yield* waitFor(Math.max(0, 4.05 - (useTime() - start)));
  yield* all(enfield().opacity(1, 0.35), enfield().scale(1, 0.6, easeOutBack));
  yield* waitFor(Math.max(0, 5.6 - (useTime() - start)));
  yield* all(compass().opacity(1, 0.4), brixtonHalo().opacity(0.55, 0.45), enfieldHalo().opacity(0.55, 0.45));
  yield* waitFor(Math.max(0, duration - (useTime() - start)));
});
