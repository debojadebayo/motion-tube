import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInCubic, easeOutCubic, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../../../shared/theme';

const label = 'KEY POINT';
const phrase = 'Cut while they move';

export default makeScene2D(function* (view) {
  const card = createRef<Rect>();

  yield* loadFonts();

  view.add(
    <Rect
      ref={card}
      layout
      direction="column"
      alignItems="start"
      gap={16}
      padding={[28, 40]}
      radius={18}
      fill={theme.plate}
      shadowBlur={48}
      shadowColor={'rgba(0, 0, 0, 0.5)'}
      shadowOffsetY={18}
      y={-150}
      opacity={0}
      scale={0.94}
    >
      <Layout layout direction="column" alignItems="start" gap={10}>
        <Txt
          text={label}
          fontFamily={theme.font}
          fontSize={18}
          fontWeight={700}
          letterSpacing={4}
          fill={theme.accent}
        />
        <Rect width={48} height={4} radius={2} fill={theme.accent} />
      </Layout>
      <Txt
        text={phrase}
        fontFamily={theme.font}
        fontSize={52}
        fontWeight={800}
        fill={theme.paper}
      />
    </Rect>,
  );

  yield* all(
    card().opacity(1, 0.28),
    card().scale(1, 0.45, easeOutCubic),
  );
  yield* waitFor(1.9);
  yield* all(
    card().opacity(0, 0.28),
    card().scale(0.97, 0.3, easeInCubic),
  );
});
