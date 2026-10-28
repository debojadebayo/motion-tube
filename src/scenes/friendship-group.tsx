import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  sequence,
  useTime,
  waitFor,
} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

const duration = 13;

export default makeScene2D(function* (view) {
  const paper = createRef<Node>();
  const person = (
    name: string,
    position: [number, number],
    listY: number,
    fill: string,
  ) => ({name, position, listY, fill, node: createRef<Node>(), ring: createRef<Node>(), label: createRef<Txt>()});
  const graphFontSize = (name: string) => name === 'Emmanuel' ? 28 : name.length >= 9 ? 27 : name.length >= 8 ? 32 : name.length >= 6 ? 44 : 54;
  const people = {
    Daniel: person('Daniel', [-550, -220], -235, theme.accent),
    Sam: person('Sam', [-250, 20], -163, '#bcd9df'),
    Femi: person('Femi', [190, -250], -91, '#f6d78c'),
    Priya: person('Priya', [590, -200], -19, '#dac8ed'),
    Margaret: person('Margaret', [500, 260], 53, '#c5d9b6'),
    Jo: person('Jo', [-620, 270], 125, '#f3b7a7'),
    Emmanuel: person('Emmanuel', [-160, 220], 197, '#b7c9ed'),
    Mia: person('Mia', [130, 40], 269, '#e5caa7'),
  };
  const friends = Object.values(people);
  const boundaryPoints = (
    from: [number, number],
    to: [number, number],
  ): [[number, number], [number, number]] => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const distance = Math.hypot(dx, dy);
    const offsetX = dx / distance * 90;
    const offsetY = dy / distance * 90;
    return [
      [from[0] + offsetX, from[1] + offsetY],
      [to[0] - offsetX, to[1] - offsetY],
    ];
  };
  const connections = [
    [people.Daniel, people.Sam],
    [people.Mia, people.Femi],
    [people.Jo, people.Emmanuel],
    [people.Daniel, people.Femi],
    [people.Priya, people.Margaret],
    [people.Sam, people.Mia],
    [people.Femi, people.Emmanuel],
    [people.Daniel, people.Jo],
    [people.Mia, people.Priya],
    [people.Emmanuel, people.Margaret],
    [people.Sam, people.Emmanuel],
    [people.Mia, people.Margaret],
  ].map(([from, to]) => ({
    points: boundaryPoints(from.position, to.position),
    line: createRef<Line>(),
  }));

  view.fill('#f5f5f5');
  yield* loadFonts();
  const start = useTime();

  view.add(
    <>
      <Txt
        y={-420}
        text={'FRIENDSHIP GROUP'}
        fontFamily={theme.font}
        fontSize={78}
        fontWeight={800}
        fill={theme.ink}
      />
      <Line
        points={[[-80, -359], [80, -359]]}
        stroke={theme.accent}
        lineWidth={10}
        lineCap={'round'}
      />

      <Node ref={paper} y={40} opacity={0} scale={0.94}>
        <Rect x={13} y={15} width={600} height={710} radius={24} fill={theme.ink} opacity={0.12} />
        <Rect width={600} height={710} radius={24} fill={'#ffffff'} stroke={theme.ink} lineWidth={8} />
        <Rect x={-220} y={-282} width={46} height={22} radius={6} fill={theme.accent} />
        {friends.map(friend => (
          <Line
            points={[[-212, friend.listY - 40], [212, friend.listY - 40]]}
            stroke={theme.ink}
            lineWidth={4}
            opacity={0.1}
            lineCap={'round'}
          />
        ))}
      </Node>

      {connections.map(connection => (
        <Line
          ref={connection.line}
          points={connection.points}
          stroke={theme.ink}
          lineWidth={9}
          lineCap={'round'}
          end={0}
        />
      ))}

      {friends.map(friend => (
        <Node ref={friend.node} y={friend.listY} opacity={0}>
          <Node ref={friend.ring} opacity={0} scale={0.72}>
            <Circle x={9} y={11} size={180} fill={theme.ink} opacity={0.13} />
            <Circle size={180} fill={friend.fill} stroke={theme.ink} lineWidth={8} />
          </Node>
          <Txt
            ref={friend.label}
            text={friend.name}
            fontFamily={theme.font}
            fontSize={54}
            fontWeight={700}
            fill={theme.ink}
          />
        </Node>
      ))}
    </>,
  );

  yield* all(
    paper().opacity(1, 0.25),
    paper().scale(1, 0.45, easeOutBack),
    sequence(0.08, ...friends.map(friend => friend.node().opacity(1, 0.25))),
  );
  yield* waitFor(Math.max(0, 3 - (useTime() - start)));

  yield* all(
    paper().opacity(0, 0.5, easeOutCubic),
    paper().scale(0.94, 0.65, easeOutCubic),
    sequence(0.1, ...friends.map(friend => all(
      friend.node().position(friend.position, 1.25, easeInOutCubic),
      friend.label().fontSize(graphFontSize(friend.name), 1.25, easeInOutCubic),
    ))),
  );
  yield* waitFor(Math.max(0, 7 - (useTime() - start)));

  yield* sequence(0.28, ...friends.map(friend => all(
    friend.ring().opacity(1, 0.2),
    friend.ring().scale(1, 0.5, easeOutBack),
  )));
  yield* waitFor(Math.max(0, 9.5 - (useTime() - start)));

  yield* sequence(0.22, ...connections.map(connection => (
    connection.line().end(1, 0.5, easeInOutCubic)
  )));
  yield* waitFor(Math.max(0, duration - (useTime() - start)));
});
