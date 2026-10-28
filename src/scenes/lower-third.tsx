import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInCubic, easeOutCubic, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

const name = 'Debo Jadebayo';
const role = 'Host';

const restX = -864;
const offscreenX = -1600;
const bottom = 420;

export default makeScene2D(function* (view) {
  const plate = createRef<Rect>();

  yield* loadFonts();

  view.add(
    <Rect
      ref={plate}
      layout
      direction="row"
      alignItems="center"
      gap={18}
      padding={[26, 36, 26, 22]}
      radius={16}
      fill={theme.plate}
      shadowBlur={40}
      shadowColor={'rgba(0, 0, 0, 0.5)'}
      shadowOffsetY={16}
      offset={[-1, 1]}
      x={offscreenX}
      y={bottom}
      opacity={0}
    >
      <Rect width={8} height={46} radius={4} fill={theme.accent} />
      <Layout layout direction="column" alignItems="start" gap={6}>
        <Txt
          text={name}
          fontFamily={theme.font}
          fontSize={40}
          fontWeight={700}
          fill={theme.paper}
        />
        <Txt
          text={role}
          fontFamily={theme.font}
          fontSize={22}
          fontWeight={500}
          letterSpacing={1.5}
          fill={theme.muted}
        />
      </Layout>
    </Rect>,
  );

  yield* all(
    plate().x(restX, 0.55, easeOutCubic),
    plate().opacity(1, 0.25),
  );
  yield* waitFor(2.4);
  yield* all(
    plate().x(offscreenX, 0.4, easeInCubic),
    plate().opacity(0, 0.3),
  );
});
