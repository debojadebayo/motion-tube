import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  sequence,
  waitFor,
} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

const exampleValues = [
  '0.214,',
  '-0.087,',
  '0.631,',
  '-0.402,',
  '0.019,',
  '0.308,',
  '-0.156,',
  '0.724,',
  '⋮',
];

export default makeScene2D(function* (view) {
  const card = createRef<Node>();
  const backing = createRef<Rect>();
  const panel = createRef<Rect>();
  const phrase = createRef<Txt>();
  const vector = createRef<Node>();
  const values = exampleValues.map(() => createRef<Txt>());

  view.fill('#f5f5f5');
  yield* loadFonts();

  view.add(
    <Node ref={card} y={45} opacity={0} scale={0.86}>
      <Rect
        ref={backing}
        x={13}
        y={15}
        width={1100}
        height={230}
        radius={42}
        fill={theme.accent}
      />
      <Rect
        ref={panel}
        width={1100}
        height={230}
        radius={42}
        fill={theme.paper}
        stroke={theme.ink}
        lineWidth={8}
      />
      <Txt
        ref={phrase}
        text={'customer churn'}
        fontFamily={theme.font}
        fontSize={112}
        fontWeight={800}
        fill={theme.ink}
      />
      <Node ref={vector} opacity={0}>
        <Line
          points={[[-168, -257], [-216, -257], [-216, 279], [-168, 279]]}
          stroke={theme.ink}
          lineWidth={10}
          lineCap={'round'}
          lineJoin={'round'}
        />
        <Line
          points={[[168, -257], [216, -257], [216, 279], [168, 279]]}
          stroke={theme.ink}
          lineWidth={10}
          lineCap={'round'}
          lineJoin={'round'}
        />
        {exampleValues.map((value, index) => (
          <Txt
            ref={values[index]}
            x={-16}
            y={-220 + index * 58}
            text={value}
            fontFamily={theme.font}
            fontSize={52}
            fontWeight={600}
            fill={index === 8 ? theme.accent : theme.ink}
            opacity={0}
          />
        ))}
      </Node>
    </Node>,
  );

  yield* all(
    card().opacity(1, 0.3),
    card().y(0, 0.45, easeOutCubic),
    card().scale(1, 0.45, easeOutBack),
  );
  yield* waitFor(2.83);
  yield* all(
    card().rotation(-3, 0.22, easeInOutCubic),
    card().scale([1.05, 0.94], 0.22, easeInOutCubic),
  );
  yield* all(
    phrase().opacity(0, 0.2),
    phrase().scale.x(0.08, 0.38, easeInCubic),
    panel().width(120, 0.38, easeInCubic),
    backing().width(120, 0.38, easeInCubic),
    panel().height(260, 0.38, easeInCubic),
    backing().height(260, 0.38, easeInCubic),
    card().rotation(3, 0.38, easeInOutCubic),
  );
  yield* all(
    panel().size([740, 790], 0.6, easeOutBack),
    backing().size([740, 790], 0.6, easeOutBack),
    card().rotation(0, 0.6, easeOutCubic),
    card().scale(1, 0.6, easeOutCubic),
    vector().opacity(1, 0.6, easeOutCubic),
  );
  yield* all(
    sequence(
      0.075,
      ...values.map(value => all(
        value().opacity(1, 0.25),
        value().x(0, 0.25, easeOutCubic),
      )),
    ),
  );
  yield* waitFor(1.97);
  yield* card().scale([1.04, 0.96], 0.2, easeInOutCubic);
  yield* all(
    card().y(-100, 0.4, easeInCubic),
    card().opacity(0, 0.4, easeInCubic),
    card().scale([0.96, 1.04], 0.4, easeInCubic),
  );
  yield* waitFor(0.1);
});
