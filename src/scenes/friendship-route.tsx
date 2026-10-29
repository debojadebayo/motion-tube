import {Circle, Line, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutBack, useTime, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

const duration = 7.5;
const orange = '#f58a24';
const radius = 90;

export default makeScene2D(function* (view) {
  const person = (name: string, position: [number, number], fill: string) => ({
    name, position, fill, highlight: createRef<Circle>(),
  });
  const people = {
    Daniel: person('Daniel', [-550, -220], theme.accent),
    Sam: person('Sam', [-250, 20], '#bcd9df'),
    Femi: person('Femi', [190, -250], '#f6d78c'),
    Priya: person('Priya', [590, -200], '#dac8ed'),
    Margaret: person('Margaret', [500, 260], '#c5d9b6'),
    Jo: person('Jo', [-620, 270], '#f3b7a7'),
    Emmanuel: person('Emmanuel', [-160, 220], '#b7c9ed'),
    Mia: person('Mia', [130, 40], '#e5caa7'),
  };
  const you = person('You', [-770, -20], '#ffd7af');
  const youNode = createRef<Node>();
  const friends = Object.values(people);
  type Person = typeof you;
  const boundaryPoints = (from: Person, to: Person): [[number, number], [number, number]] => {
    const dx = to.position[0] - from.position[0];
    const dy = to.position[1] - from.position[1];
    const distance = Math.hypot(dx, dy);
    const offsetX = dx / distance * radius;
    const offsetY = dy / distance * radius;
    return [
      [from.position[0] + offsetX, from.position[1] + offsetY],
      [to.position[0] - offsetX, to.position[1] - offsetY],
    ];
  };
  const connections = [
    [people.Daniel, people.Sam], [people.Mia, people.Femi],
    [people.Jo, people.Emmanuel], [people.Daniel, people.Femi],
    [people.Priya, people.Margaret], [people.Sam, people.Mia],
    [people.Femi, people.Emmanuel], [people.Daniel, people.Jo],
    [people.Mia, people.Priya], [people.Emmanuel, people.Margaret],
    [people.Sam, people.Emmanuel], [people.Mia, people.Margaret],
  ];
  const route = [
    [you, people.Daniel], [people.Daniel, people.Femi],
    [people.Femi, people.Emmanuel], [people.Emmanuel, people.Margaret],
  ].map(([from, to]) => ({points: boundaryPoints(from, to), to, line: createRef<Line>()}));
  const fontSize = (name: string) => name === 'Emmanuel' ? 28 : name.length >= 9 ? 27 : name.length >= 8 ? 32 : name.length >= 6 ? 44 : 54;

  view.fill('#f5f5f5');
  yield* loadFonts();
  const start = useTime();
  view.add(
    <>
      <Txt y={-420} text={'FRIENDSHIP GROUP'} fontFamily={theme.font} fontSize={78} fontWeight={800} fill={theme.ink} />
      <Line points={[[-80, -359], [80, -359]]} stroke={theme.accent} lineWidth={10} lineCap={'round'} />
      {connections.map(([from, to]) => (
        <Line points={boundaryPoints(from, to)} stroke={theme.ink} lineWidth={9} lineCap={'round'} />
      ))}
      {route.map(segment => (
        <Line ref={segment.line} points={segment.points} stroke={orange} lineWidth={12} lineCap={'round'} endArrow arrowSize={22} end={0} />
      ))}
      {friends.map(friend => (
        <Node position={friend.position}>
          <Circle x={9} y={11} size={180} fill={theme.ink} opacity={0.13} />
          <Circle size={180} fill={friend.fill} stroke={theme.ink} lineWidth={8} />
          <Circle ref={friend.highlight} size={180} stroke={orange} lineWidth={12} opacity={0} />
          <Txt text={friend.name} fontFamily={theme.font} fontSize={fontSize(friend.name)} fontWeight={700} fill={theme.ink} />
        </Node>
      ))}
      <Node ref={youNode} opacity={0} scale={0.72} position={you.position}>
        <Circle x={9} y={11} size={180} fill={theme.ink} opacity={0.13} />
        <Circle size={180} fill={you.fill} stroke={orange} lineWidth={12} />
        <Txt text={'You'} fontFamily={theme.font} fontSize={54} fontWeight={700} fill={theme.ink} />
      </Node>
    </>,
  );

  yield* waitFor(0.25);
  yield* all(youNode().opacity(1, 0.25), youNode().scale(1, 0.55, easeOutBack));
  for (const [index, segment] of route.entries()) {
    yield* waitFor(Math.max(0, 1.1 + index * 1.25 - (useTime() - start)));
    yield* segment.line().end(1, 1.1, easeInOutCubic);
    yield* segment.to.highlight().opacity(1, 0.15);
  }
  yield* waitFor(Math.max(0, duration - (useTime() - start)));
});
