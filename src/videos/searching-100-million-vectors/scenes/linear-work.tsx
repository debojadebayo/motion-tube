import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeOutBack,
  easeOutCubic,
  useTime,
  waitFor,
} from '@motion-canvas/core';

import {loadFonts, theme} from '../../../shared/theme';

export default makeScene2D(function* (view) {
  const documentLabel = createRef<Txt>();
  const workLabel = createRef<Txt>();
  const pairs = Array.from({length: 10}, () => createRef<Node>());
  const firstPair = pairs[0];
  const columnX = (index: number) => -738 + index * 164;

  view.fill('#f5f5f5');
  yield* loadFonts();
  const start = useTime();

  view.add(
    <>
      <Node y={-365}>
        <Rect x={8} y={10} width={350} height={162} radius={30} fill={theme.ink} opacity={0.12} />
        <Rect width={350} height={162} radius={30} fill={'#ffffff'} stroke={theme.ink} lineWidth={7} />
        <Txt text={'O(n)'} fontFamily={theme.font} fontSize={120} fontWeight={800} fill={theme.ink} />
      </Node>

      <Txt
        ref={documentLabel}
        y={-226}
        text={'1 DOCUMENT'}
        fontFamily={theme.font}
        fontSize={66}
        fontWeight={800}
        fill={theme.ink}
      />

      {pairs.map((pair, index) => (
        <Node ref={pair} x={index === 0 ? 0 : columnX(index)} opacity={0} scale={0.8}>
          <Node y={-70}>
            <Rect x={7} y={8} width={112} height={148} radius={14} fill={theme.ink} opacity={0.12} />
            <Rect width={112} height={148} radius={14} fill={'#ffffff'} stroke={theme.ink} lineWidth={5} />
            <Rect x={-24} y={-42} width={30} height={14} radius={4} fill={theme.accent} />
            {[-7, 16, 39].map(y => (
              <Line points={[[-34, y], [34, y]]} stroke={theme.ink} lineWidth={5} lineCap={'round'} />
            ))}
          </Node>

          <Line
            points={[[0, 23], [0, 126]]}
            stroke={theme.ink}
            opacity={0.35}
            lineWidth={5}
            lineCap={'round'}
            endArrow
            arrowSize={13}
          />

          <Node y={200}>
            <Rect x={7} y={8} width={112} height={108} radius={20} fill={theme.ink} opacity={0.12} />
            <Rect width={112} height={108} radius={20} fill={theme.accent} stroke={theme.ink} lineWidth={5} />
            <Line
              points={[[-25, 0], [-6, 20], [28, -21]]}
              stroke={'#ffffff'}
              lineWidth={10}
              lineCap={'round'}
              lineJoin={'round'}
            />
          </Node>
        </Node>
      ))}

      <Txt
        ref={workLabel}
        y={365}
        text={'1 UNIT OF WORK'}
        fontFamily={theme.font}
        fontSize={66}
        fontWeight={800}
        fill={theme.ink}
      />
    </>,
  );

  yield* all(
    firstPair().opacity(1, 0.25),
    firstPair().scale(1, 0.35, easeOutBack),
  );
  yield* waitFor(Math.max(0, 1.2 - (useTime() - start)));
  yield* firstPair().x(columnX(0), 0.45, easeOutCubic);

  for (let index = 1; index < pairs.length; index++) {
    const pair = pairs[index];
    const revealAt = 1.65 + (index - 1) * 0.26;
    yield* waitFor(Math.max(0, revealAt - (useTime() - start)));
    documentLabel().text(`${index + 1} DOCUMENTS`);
    workLabel().text(`${index + 1} UNITS OF WORK`);
    yield* all(
      pair().opacity(1, 0.18),
      pair().scale(1, 0.24, easeOutBack),
    );
  }

  yield* waitFor(Math.max(0, 4 - (useTime() - start)));
  documentLabel().text('10× DOCUMENTS');
  workLabel().text('10× WORK');
  documentLabel().fill(theme.accent);
  workLabel().fill(theme.accent);
  documentLabel().scale(0.94);
  workLabel().scale(0.94);
  yield* all(
    documentLabel().scale(1, 0.2, easeOutBack),
    workLabel().scale(1, 0.2, easeOutBack),
  );
  yield* waitFor(Math.max(0, 6 - (useTime() - start)));
});
