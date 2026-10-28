import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInCubic, easeOutCubic, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

const kicker = 'CHAPTER 02';
const title = 'Cut on the action';
const subtitle = 'The jump should land while they are still moving.';

export default makeScene2D(function* (view) {
  const rail = createRef<Rect>();
  const column = createRef<Layout>();
  const rule = createRef<Rect>();
  const subtitleText = createRef<Txt>();

  view.fill(theme.ink);
  yield* loadFonts();

  view.add(
    <Rect
      ref={rail}
      width={16}
      height={1080}
      x={-952}
      fill={theme.accent}
      scaleY={0}
    />,
  );

  view.add(
    <Layout
      ref={column}
      layout
      direction="column"
      alignItems="start"
      gap={28}
      offset={[-1, 0]}
      x={-820}
      y={36}
      opacity={0}
    >
      <Txt
        text={kicker}
        fontFamily={theme.font}
        fontSize={22}
        fontWeight={600}
        letterSpacing={6}
        fill={theme.accent}
      />
      <Txt
        text={title}
        width={1100}
        textWrap
        fontFamily={theme.font}
        fontSize={92}
        fontWeight={800}
        lineHeight={100}
        fill={theme.paper}
      />
      <Rect
        ref={rule}
        width={168}
        height={6}
        radius={3}
        fill={theme.accent}
        offset={[-1, 0]}
        scaleX={0}
      />
      <Txt
        ref={subtitleText}
        text={subtitle}
        width={860}
        textWrap
        fontFamily={theme.font}
        fontSize={30}
        fontWeight={500}
        lineHeight={42}
        fill={theme.muted}
        opacity={0}
      />
    </Layout>,
  );

  yield* rail().scale.y(1, 0.5, easeOutCubic);
  yield* all(
    column().opacity(1, 0.4),
    column().y(0, 0.55, easeOutCubic),
  );
  yield* rule().scale.x(1, 0.4, easeOutCubic);
  yield* subtitleText().opacity(1, 0.35);
  yield* waitFor(1.6);
  yield* all(
    column().opacity(0, 0.35, easeInCubic),
    column().y(-24, 0.35, easeInCubic),
    rail().scale.y(0, 0.4, easeInCubic),
  );
});
