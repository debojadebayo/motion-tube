import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInCubic,
  easeInQuad,
  easeOutCubic,
  easeOutQuad,
  linear,
  waitFor,
} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

export default makeScene2D(function* (view) {
  const sign = createRef<Node>();

  view.fill('#f5f5f5');
  yield* loadFonts();

  view.add(
    <Node ref={sign} x={-1450} y={310} rotation={-16}>
      <Circle
        y={16}
        width={290}
        height={28}
        fill={'#090908'}
        opacity={0.65}
      />
      <Rect
        y={-104}
        width={48}
        height={240}
        radius={16}
        fill={theme.accent}
      />
      <Rect
        x={-9}
        y={-90}
        width={8}
        height={166}
        radius={4}
        fill={theme.paper}
        opacity={0.45}
      />
      <Rect
        y={-405}
        width={780}
        height={450}
        radius={48}
        fill={theme.accent}
        rotation={2}
      />
      <Rect
        y={-418}
        width={780}
        height={450}
        radius={48}
        lineWidth={12}
        stroke={theme.accent}
        fill={theme.paper}
      >
        <Txt
          y={-116}
          text={'FORTUNE'}
          fontFamily={theme.font}
          fontSize={82}
          fontWeight={800}
          letterSpacing={5}
          fill={theme.ink}
        />
        <Txt
          y={48}
          text={'500'}
          fontFamily={theme.font}
          fontSize={224}
          fontWeight={900}
          letterSpacing={-6}
          fill={theme.accent}
        />
        <Circle x={-330} y={-170} size={12} fill={theme.accent} />
        <Circle x={330} y={-170} size={12} fill={theme.accent} />
        <Circle x={-330} y={170} size={12} fill={theme.accent} />
        <Circle x={330} y={170} size={12} fill={theme.accent} />
      </Rect>
    </Node>,
  );

  yield* waitFor(0.12);
  yield* all(
    sign().x(-360, 0.72, easeOutCubic),
    sign().y(195, 0.36, easeOutQuad).to(310, 0.36, easeInQuad),
    sign().rotation(8, 0.72, easeOutCubic),
    sign().scale([0.96, 1.04], 0.56).to([1.07, 0.93], 0.16),
  );
  yield* all(
    sign().x(125, 0.58, linear),
    sign().y(205, 0.29, easeOutQuad).to(310, 0.29, easeInQuad),
    sign().rotation(-7, 0.58, easeOutCubic),
    sign().scale([0.96, 1.04], 0.18).to([1.05, 0.95], 0.4),
  );
  yield* all(
    sign().x(0, 0.38, easeOutCubic),
    sign().y(262, 0.19, easeOutQuad).to(310, 0.19, easeInQuad),
    sign().rotation(3, 0.38, easeOutCubic),
    sign().scale([0.98, 1.02], 0.16).to([1.03, 0.97], 0.22),
  );
  yield* all(
    sign().rotation(0, 0.26, easeOutCubic),
    sign().scale(1, 0.26, easeOutCubic),
  );
  yield* waitFor(1.42);
  yield* all(
    sign().x(-45, 0.2, easeInCubic),
    sign().rotation(-8, 0.2, easeInCubic),
    sign().scale([1.06, 0.94], 0.2, easeInCubic),
  );
  yield* all(
    sign().x(1450, 0.72, easeInCubic),
    sign().y(165, 0.36, easeOutQuad).to(290, 0.36, easeInQuad),
    sign().rotation(15, 0.72, easeOutCubic),
    sign().scale([0.96, 1.04], 0.28, easeOutCubic),
  );
  yield* waitFor(0.1);
});
