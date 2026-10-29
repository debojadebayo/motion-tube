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
  const heading = createRef<Txt>();
  const documents = createRef<Node>();
  const extraDocuments = createRef<Node>();
  const clockPanel = createRef<Node>();
  const clockDigits = createRef<Txt>();

  view.fill('#f5f5f5');
  yield* loadFonts();
  const start = useTime();

  const document = (x: number, y: number, rotation: number) => (
    <Node x={x} y={y} rotation={rotation}>
      <Rect x={10} y={12} width={210} height={270} radius={20} fill={theme.ink} opacity={0.12} />
      <Rect width={210} height={270} radius={20} fill={'#ffffff'} stroke={theme.ink} lineWidth={7} />
      <Rect x={-42} y={-77} width={67} height={23} radius={7} fill={theme.accent} />
      {[-20, 22, 64].map(y => (
        <Line points={[[-70, y], [70, y]]} stroke={theme.ink} lineWidth={7} lineCap={'round'} />
      ))}
    </Node>
  );

  view.add(
    <>
      <Txt
        ref={heading}
        y={-290}
        text={'100 MILLION DOCUMENTS'}
        fontFamily={theme.font}
        fontSize={96}
        fontWeight={800}
        fill={theme.ink}
      />

      <Node ref={documents} x={-470} y={115} opacity={0} scale={0.9}>
        <Node ref={extraDocuments} opacity={0}>
          {document(-125, -63, -20)}
          {document(126, -75, 19)}
          {document(-30, -104, -6)}
        </Node>
        {document(-72, 24, -14)}
        {document(73, 11, 13)}
        {document(0, 48, 0)}
      </Node>

      <Line
        points={[[-125, 122], [90, 122]]}
        stroke={theme.ink}
        lineWidth={11}
        lineCap={'round'}
        endArrow
        arrowSize={26}
      />

      <Node ref={clockPanel} x={442} y={124} opacity={0} scale={0.9}>
        <Rect x={12} y={14} width={590} height={350} radius={34} fill={theme.ink} opacity={0.12} />
        <Rect width={590} height={350} radius={34} fill={'#ffffff'} stroke={theme.ink} lineWidth={8} />
        <Rect y={-24} width={526} height={220} radius={20} fill={theme.paper} />
        <Txt
          ref={clockDigits}
          y={-27}
          text={'00:10'}
          fontFamily={'monospace'}
          fontSize={126}
          fontWeight={700}
          fill={theme.accent}
        />
        <Txt
          y={119}
          text={'MIN:SEC'}
          fontFamily={theme.font}
          fontSize={30}
          fontWeight={700}
          fill={theme.ink}
          opacity={0.65}
        />
      </Node>

    </>,
  );

  yield* all(
    documents().opacity(1, 0.3),
    documents().scale(1, 0.45, easeOutBack),
    clockPanel().opacity(1, 0.3),
    clockPanel().scale(1, 0.45, easeOutBack),
  );
  yield* waitFor(Math.max(0, 5 - (useTime() - start)));

  // The document count switches at exactly 5s; the second phase lasts through 9s.
  heading().text('1 BILLION DOCUMENTS');
  clockDigits().text('01:00+');
  clockDigits().opacity(0);
  clockDigits().scale(0.9);
  yield* all(
    extraDocuments().opacity(1, 0.35),
    documents().scale(1.17, 0.5, easeOutBack),
    clockDigits().opacity(1, 0.25, easeOutCubic),
    clockDigits().scale(1, 0.35, easeOutBack),
  );
  yield* waitFor(Math.max(0, 9 - (useTime() - start)));
});
