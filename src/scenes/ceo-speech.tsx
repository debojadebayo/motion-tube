import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

const background = '#f5f5f5';
const skin = '#f3c9a5';
const shirt = '#ffffff';

export default makeScene2D(function* (view) {
  const speakingArm = createRef<Node>();
  const mouth = createRef<Circle>();
  const speech = createRef<Node>();

  view.fill(background);
  yield* loadFonts();

  view.add(
    <>
      <Line
        points={[[-750, 360], [750, 360]]}
        stroke={theme.ink}
        lineWidth={5}
        opacity={0.2}
        lineCap={'round'}
      />

      <Node x={-200}>
        <Circle y={346} width={250} height={25} fill={theme.ink} opacity={0.14} />
        <Line
          points={[[-40, 75], [-40, 203], [-40, 328]]}
          stroke={theme.ink}
          lineWidth={44}
          lineCap={'round'}
          lineJoin={'round'}
        />
        <Line
          points={[[42, 75], [42, 203], [42, 328]]}
          stroke={theme.ink}
          lineWidth={44}
          lineCap={'round'}
          lineJoin={'round'}
        />
        <Rect
          x={-26}
          y={333}
          width={86}
          height={33}
          radius={16}
          fill={theme.accent}
        />
        <Rect
          x={56}
          y={333}
          width={86}
          height={33}
          radius={16}
          fill={theme.accent}
        />

        <Node y={-35}>
          <Node x={-78} y={-65} rotation={18}>
            <Line points={[[0, 0], [-12, 76], [12, 125]]} stroke={theme.ink} lineWidth={36} lineCap={'round'} lineJoin={'round'} />
            <Circle x={12} y={132} size={38} fill={skin} stroke={theme.ink} lineWidth={5} />
          </Node>
          <Rect width={164} height={224} radius={[48, 48, 24, 24]} fill={shirt} stroke={theme.ink} lineWidth={7} />
          <Line points={[[-45, -105], [0, -38], [45, -105]]} stroke={theme.ink} lineWidth={9} lineJoin={'round'} />
          <Line points={[[0, -71], [0, 57]]} stroke={theme.accent} lineWidth={19} lineCap={'round'} />
          <Circle x={27} y={82} size={10} fill={theme.ink} />
          <Node ref={speakingArm} x={78} y={-65} rotation={-24}>
            <Line points={[[0, 0], [9, 75], [0, 125]]} stroke={theme.ink} lineWidth={36} lineCap={'round'} lineJoin={'round'} />
            <Circle y={134} size={40} fill={skin} stroke={theme.ink} lineWidth={5} />
          </Node>

          <Rect y={-117} width={43} height={48} radius={12} fill={theme.accent} />
          <Node y={-182}>
            <Circle x={-55} y={5} size={25} fill={skin} stroke={theme.ink} lineWidth={6} />
            <Circle x={55} y={5} size={25} fill={skin} stroke={theme.ink} lineWidth={6} />
            <Circle width={112} height={134} fill={skin} stroke={theme.ink} lineWidth={7} />
            <Rect x={-20} y={-9} width={10} height={13} radius={5} fill={theme.ink} />
            <Rect x={20} y={-9} width={10} height={13} radius={5} fill={theme.ink} />
            <Circle ref={mouth} y={29} width={25} height={7} fill={theme.ink} />
          </Node>
        </Node>
      </Node>

      <Node x={180}>
        <Rect y={342} width={340} height={26} radius={13} fill={theme.accent} />
        <Rect y={230} width={240} height={226} radius={16} fill={theme.accent} />
        <Rect y={202} width={204} height={115} radius={12} fill={theme.paper} />
        <Txt y={202} text={'CEO'} fontFamily={theme.font} fontSize={65} fontWeight={900} letterSpacing={3} fill={theme.ink} />
        <Rect y={112} width={304} height={28} radius={14} fill={theme.paper} />
        <Line points={[[48, 98], [48, 51], [20, 35]]} stroke={theme.ink} lineWidth={10} lineCap={'round'} lineJoin={'round'} />
        <Circle x={14} y={31} width={33} height={17} rotation={30} fill={theme.ink} />
      </Node>

      <Node ref={speech} x={70} y={-235} opacity={0} scale={0.8}>
        <Line points={[[-30, -43], [-12, -76]]} stroke={theme.accent} lineWidth={12} lineCap={'round'} />
        <Line points={[[-2, -12], [43, -25]]} stroke={theme.ink} lineWidth={12} lineCap={'round'} />
        <Line points={[[-4, 25], [35, 42]]} stroke={theme.accent} lineWidth={12} lineCap={'round'} />
      </Node>
    </>,
  );

  yield* waitFor(0.3);
  yield* all(
    speakingArm().rotation(-106, 0.35, easeOutBack),
    speech().opacity(1, 0.35),
    speech().scale(1, 0.35, easeOutBack),
    mouth().height(23, 0.175).to(8, 0.175),
  );
  for (let beat = 0; beat < 7; beat++) {
    yield* all(
      speakingArm().rotation(-126, 0.18, easeOutCubic).to(-99, 0.32, easeInOutCubic),
      mouth().height(25, 0.13).to(7, 0.12).to(18, 0.13).to(7, 0.12),
      speech().scale(1.14, 0.18, easeOutCubic).to(1, 0.32, easeInOutCubic),
      speech().opacity(1, 0.18).to(0.5, 0.32),
    );
  }
  yield* all(
    speakingArm().rotation(-24, 0.3, easeOutCubic),
    speech().opacity(1, 0.15).to(0, 0.15),
    mouth().height(20, 0.15).to(7, 0.15),
  );
  yield* waitFor(0.55);
});
