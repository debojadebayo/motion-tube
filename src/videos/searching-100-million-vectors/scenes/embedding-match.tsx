import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  useTime,
  waitFor,
} from '@motion-canvas/core';

import {loadFonts, theme} from '../../../shared/theme';

// Illustrative values, shared between the opening list and the final comparison.
const embeddings = [
  {label: 'billing and invoices', values: '[ -0.512,  0.381,  0.096,  0.745, … ]'},
  {label: 'customer churn', values: '[ 0.214,  -0.087,  0.631,  -0.402, … ]'},
  {label: 'end-of-year party info', values: '[ 0.709,  0.452,  -0.328,  0.064, … ]'},
  {label: 'new customer onboarding', values: '[ -0.193,  0.662,  0.417,  0.283, … ]'},
];

export default makeScene2D(function* (view) {
  const list = createRef<Node>();
  const rows = embeddings.map(() => createRef<Rect>());
  const matchingRow = rows[1];
  const question = createRef<Node>();
  const questionBacking = createRef<Rect>();
  const questionPanel = createRef<Rect>();
  const questionMark = createRef<Txt>();
  const query = createRef<Node>();
  const questionText = createRef<Txt>();
  const vectorPanel = createRef<Rect>();
  const queryValues = createRef<Txt>();
  const connection = createRef<Line>();
  const matchLabel = createRef<Txt>();

  view.fill('#f5f5f5');
  yield* loadFonts();
  const start = useTime();

  view.add(
    <>
      <Node ref={list} opacity={0} scale={0.94} y={20}>
        <Rect x={12} y={14} width={1450} height={810} radius={40} fill={theme.ink} opacity={0.12} />
        <Rect width={1450} height={810} radius={40} fill={'#ffffff'} stroke={theme.ink} lineWidth={8} />
        <Txt y={-338} text={'Embeddings'} fontFamily={theme.font} fontSize={62} fontWeight={800} fill={theme.ink} />
        {embeddings.map((embedding, index) => (
          <Node y={-205 + index * 155}>
            <Rect
              ref={rows[index]}
              width={1290}
              height={132}
              radius={24}
              fill={theme.paper}
              stroke={theme.ink}
              lineWidth={4}
            />
            <Txt y={-34} text={embedding.label} fontFamily={theme.font} fontSize={34} fontWeight={700} fill={theme.ink} />
            <Txt y={27} text={embedding.values} fontFamily={theme.font} fontSize={46} fontWeight={600} fill={theme.ink} />
          </Node>
        ))}
      </Node>

      <Line
        ref={connection}
        points={[[-246, 84], [-175, 84], [-175, -8], [-68, -8]]}
        stroke={theme.accent}
        lineWidth={9}
        lineCap={'round'}
        lineJoin={'round'}
        endArrow
        arrowSize={22}
        end={0}
      />

      <Node ref={question} opacity={0} scale={0.83}>
        <Rect ref={questionBacking} x={12} y={14} width={740} height={650} radius={42} fill={theme.accent} />
        <Rect ref={questionPanel} width={740} height={650} radius={42} fill={'#ffffff'} stroke={theme.ink} lineWidth={8} />
        <Txt ref={questionMark} text={'?'} y={-10} fontFamily={theme.font} fontSize={350} fontWeight={800} fill={theme.ink} />
        <Node ref={query} opacity={0}>
          <Txt
            ref={questionText}
            y={-236}
            text={'Why are customers\nleaving?'}
            textAlign={'center'}
            fontFamily={theme.font}
            fontSize={66}
            fontWeight={800}
            fill={theme.ink}
          />
          <Txt y={-65} text={'Question embedding'} fontFamily={theme.font} fontSize={36} fontWeight={700} fill={theme.ink} />
          <Rect ref={vectorPanel} y={92} width={910} height={240} radius={28} fill={theme.paper} stroke={theme.ink} lineWidth={5} />
          <Txt
            ref={queryValues}
            y={92}
            text={'[ 0.218,  -0.083,\n  0.627,  -0.397, … ]'}
            textAlign={'center'}
            fontFamily={theme.font}
            fontSize={66}
            fontWeight={600}
            fill={theme.ink}
          />
        </Node>
      </Node>

      <Txt
        ref={matchLabel}
        x={390}
        y={373}
        text={'Closest match'}
        fontFamily={theme.font}
        fontSize={42}
        fontWeight={800}
        fill={theme.accent}
        opacity={0}
      />
    </>,
  );

  yield* all(
    list().opacity(1, 0.35),
    list().scale(1, 0.45, easeOutBack),
    list().y(0, 0.45, easeOutCubic),
  );

  // 0–4s: the original list. Begin the question transition exactly at 4s.
  yield* waitFor(Math.max(0, 4 - (useTime() - start)));
  yield* all(
    list().opacity(0, 0.3),
    list().scale(0.92, 0.4, easeInOutCubic),
    question().opacity(1, 0.4),
    question().scale(1, 0.5, easeOutBack),
  );

  // 4–6s: a question-mark box. Begin its embedding transformation at 6s.
  yield* waitFor(Math.max(0, 6 - (useTime() - start)));
  yield* all(
    questionMark().opacity(0, 0.2),
    questionMark().scale(0.7, 0.35, easeInOutCubic),
    questionPanel().size([1100, 750], 0.6, easeOutBack),
    questionBacking().size([1100, 750], 0.6, easeOutBack),
    query().opacity(1, 0.6, easeOutCubic),
  );

  // 6–10s: hold the question and its illustrative embedding together.
  yield* waitFor(Math.max(0, 10 - (useTime() - start)));
  list().position([390, 25]);
  list().scale(0.65);
  yield* all(
    question().x(-580, 0.6, easeInOutCubic),
    questionPanel().width(650, 0.6, easeInOutCubic),
    questionBacking().width(650, 0.6, easeInOutCubic),
    questionText().fontSize(48, 0.6, easeInOutCubic),
    queryValues().fontSize(48, 0.6, easeInOutCubic),
    vectorPanel().width(550, 0.6, easeInOutCubic),
    list().opacity(1, 0.5, easeOutCubic),
    matchingRow().fill('#ffe2d7', 0.6),
    matchingRow().stroke(theme.accent, 0.6),
    matchingRow().lineWidth(9, 0.6),
    connection().end(1, 0.6, easeOutCubic),
    matchLabel().opacity(1, 0.6),
  );

  // Hold the comparison through the final frame; exact scene length: 13s.
  yield* waitFor(Math.max(0, 13 - (useTime() - start)));
});
