import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';

import {loadFonts, theme} from '../../../shared/theme';

const duration = 10;

export default makeScene2D(function* (view) {
  const graph = createRef<Node>();
  const customer = createRef<Node>();
  const client = createRef<Node>();
  const party = createRef<Node>();
  const proximity = createRef<Circle>();

  view.fill('#f5f5f5');
  yield* loadFonts();

  view.add(
    <Node ref={graph} opacity={0} scale={0.94} y={15}>
      <Rect x={12} y={14} width={1700} height={820} radius={36} fill={theme.ink} opacity={0.12} />
      <Rect width={1700} height={820} radius={36} fill={'#ffffff'} stroke={theme.ink} lineWidth={8} />

      {[-520, -320, -120, 80, 280, 480, 680].map(x => (
        <Line points={[[x, -325], [x, 310]]} stroke={theme.ink} lineWidth={2} opacity={0.08} />
      ))}
      {[-290, -140, 10, 160].map(y => (
        <Line points={[[-720, y], [740, y]]} stroke={theme.ink} lineWidth={2} opacity={0.08} />
      ))}
      <Line points={[[-720, 310], [755, 310]]} stroke={theme.ink} lineWidth={6} endArrow arrowSize={16} lineCap={'round'} />
      <Line points={[[-720, 310], [-720, -335]]} stroke={theme.ink} lineWidth={6} endArrow arrowSize={16} lineCap={'round'} />
      <Txt x={775} y={347} text={'X'} fontFamily={theme.font} fontSize={34} fontWeight={700} fill={theme.ink} />
      <Txt x={-760} y={-341} text={'Y'} fontFamily={theme.font} fontSize={34} fontWeight={700} fill={theme.ink} />

      <Circle
        ref={proximity}
        x={-345}
        y={20}
        width={370}
        height={270}
        fill={theme.accent}
        opacity={0}
        scale={0.85}
      />

      <Node ref={customer} x={-440} y={-50} opacity={0} scale={0.6}>
        <Circle x={5} y={7} size={56} fill={theme.ink} opacity={0.14} />
        <Circle size={56} fill={theme.accent} stroke={theme.ink} lineWidth={5} />
        <Circle x={-7} y={-8} size={13} fill={'#ffffff'} />
        <Txt x={-20} y={-100} text={'customer churn'} fontFamily={theme.font} fontSize={48} fontWeight={700} fill={theme.ink} />
      </Node>

      <Node ref={client} x={-250} y={90} opacity={0} scale={0.6}>
        <Circle x={5} y={7} size={56} fill={theme.ink} opacity={0.14} />
        <Circle size={56} fill={theme.accent} stroke={theme.ink} lineWidth={5} />
        <Circle x={-7} y={-8} size={13} fill={'#ffffff'} />
        <Txt y={100} text={'client attrition'} fontFamily={theme.font} fontSize={48} fontWeight={700} fill={theme.ink} />
      </Node>

      <Node ref={party} x={570} y={-190} opacity={0} scale={0.6}>
        <Circle x={5} y={7} size={56} fill={theme.ink} opacity={0.14} />
        <Circle size={56} fill={'#91b9c7'} stroke={theme.ink} lineWidth={5} />
        <Circle x={-7} y={-8} size={13} fill={'#ffffff'} />
        <Txt x={-170} y={-95} text={'end-of-year party info'} fontFamily={theme.font} fontSize={48} fontWeight={700} fill={theme.ink} />
      </Node>
    </Node>,
  );

  yield* all(
    graph().opacity(1, 0.5),
    graph().scale(1, 0.5, easeOutCubic),
    graph().y(0, 0.5, easeOutCubic),
  );
  yield* waitFor(1.5);
  yield* all(
    customer().opacity(1, 0.25),
    customer().scale(1, 0.4, easeOutBack),
  );
  yield* waitFor(0.6);
  yield* all(
    client().opacity(1, 0.25),
    client().scale(1, 0.4, easeOutBack),
  );
  yield* all(
    proximity().opacity(0.12, 0.6, easeOutCubic),
    proximity().scale(1, 0.6, easeOutCubic),
  );
  yield* waitFor(5);
  yield* all(
    party().opacity(1, 0.25),
    party().scale(1, 0.4, easeOutBack),
  );
  yield* waitFor(duration - 9.4);
});
