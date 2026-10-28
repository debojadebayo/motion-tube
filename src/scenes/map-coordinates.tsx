import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

import {loadFonts, theme} from '../theme';

const duration = 10;
const coordinateUnit = 150;
const origin = {x: -400, y: 260};
const coordinates = {x: 4, y: 3};
const point = {
  x: origin.x + coordinates.x * coordinateUnit,
  y: origin.y - coordinates.y * coordinateUnit,
};

export default makeScene2D(function* (view) {
  const xCoordinate = createRef<Txt>();
  const yCoordinate = createRef<Txt>();

  view.fill('#f5f5f5');
  yield* loadFonts();

  view.add(
    <>
      <Node x={-330}>
        <Rect x={12} y={14} width={1040} height={760} radius={35} fill={theme.ink} opacity={0.12} />
        <Rect width={1040} height={760} radius={35} fill={'#e4ebd6'} stroke={theme.ink} lineWidth={8} />

        <Rect width={1028} height={748} radius={30} clip>
          <Line
            points={[[420, -420], [345, -265], [465, -80], [410, 120], [570, 300]]}
            stroke={'#91b9c7'}
            lineWidth={145}
            lineCap={'round'}
            lineJoin={'round'}
          />
          {[-280, -80, 120, 320].map((x, column) =>
            [-245, -45, 155].map((y, row) => (
              <Node x={x} y={y} rotation={(column + row) % 2 === 0 ? -3 : 3}>
                <Rect width={110} height={100} radius={17} fill={(column + row) % 3 === 0 ? '#a6bd90' : '#e6cf9e'} stroke={theme.ink} lineWidth={4} />
                {(column + row) % 3 !== 0 && (
                  <>
                    <Rect x={-20} y={-12} width={42} height={48} radius={6} fill={theme.paper} stroke={theme.ink} lineWidth={3} />
                    <Rect x={27} y={20} width={31} height={34} radius={5} fill={'#d18c73'} stroke={theme.ink} lineWidth={3} />
                  </>
                )}
                {(column + row) % 3 === 0 && (
                  <>
                    <Circle x={-19} y={-14} size={36} fill={'#78976c'} stroke={theme.ink} lineWidth={3} />
                    <Circle x={22} y={20} size={42} fill={'#78976c'} stroke={theme.ink} lineWidth={3} />
                  </>
                )}
              </Node>
            )),
          )}
          {[-350, -150, 50, 250].map(x => (
            <Line points={[[x, -370], [x, 370]]} stroke={'#ffffff'} lineWidth={30} />
          ))}
          {[-145, 55].map(y => (
            <Line points={[[-510, y], [510, y]]} stroke={'#ffffff'} lineWidth={30} />
          ))}
        </Rect>

        {[1, 2, 3, 4, 5].map(value => (
          <>
            <Line points={[[origin.x + value * coordinateUnit, origin.y], [origin.x + value * coordinateUnit, -305]]} stroke={theme.ink} lineWidth={2} opacity={0.12} />
            <Txt x={origin.x + value * coordinateUnit} y={305} text={`${value}`} fontFamily={theme.font} fontSize={30} fontWeight={600} fill={theme.ink} />
          </>
        ))}
        {[1, 2, 3].map(value => (
          <>
            <Line points={[[origin.x, origin.y - value * coordinateUnit], [425, origin.y - value * coordinateUnit]]} stroke={theme.ink} lineWidth={2} opacity={0.12} />
            <Txt x={-450} y={origin.y - value * coordinateUnit} text={`${value}`} fontFamily={theme.font} fontSize={30} fontWeight={600} fill={theme.ink} />
          </>
        ))}
        <Line points={[[origin.x, origin.y], [445, origin.y]]} stroke={theme.ink} lineWidth={6} endArrow arrowSize={14} lineCap={'round'} />
        <Line points={[[origin.x, origin.y], [origin.x, -310]]} stroke={theme.ink} lineWidth={6} endArrow arrowSize={14} lineCap={'round'} />
        <Txt x={-441} y={305} text={'0'} fontFamily={theme.font} fontSize={30} fontWeight={600} fill={theme.ink} />
        <Txt x={465} y={305} text={'X'} fontFamily={theme.font} fontSize={35} fontWeight={700} fill={theme.ink} />
        <Txt x={-450} y={-315} text={'Y'} fontFamily={theme.font} fontSize={35} fontWeight={700} fill={theme.ink} />

        <Line points={[[point.x, origin.y], [point.x, point.y], [origin.x, point.y]]} stroke={theme.accent} lineWidth={6} lineDash={[13, 12]} lineCap={'round'} />
        <Node x={point.x} y={point.y}>
          <Circle y={9} width={78} height={20} fill={theme.ink} opacity={0.14} />
          <Line points={[[0, 0], [-30, -48], [30, -48]]} closed fill={theme.accent} stroke={theme.ink} lineWidth={5} lineJoin={'round'} />
          <Circle y={-57} size={76} fill={theme.accent} stroke={theme.ink} lineWidth={5} />
          <Circle y={-57} size={27} fill={'#ffffff'} stroke={theme.ink} lineWidth={4} />
        </Node>
      </Node>

      <Node x={590}>
        <Rect x={10} y={12} width={480} height={470} radius={34} fill={theme.accent} />
        <Rect width={480} height={470} radius={34} fill={'#ffffff'} stroke={theme.ink} lineWidth={7} />
        <Line points={[[-175, 0], [175, 0]]} stroke={theme.ink} opacity={0.12} lineWidth={3} />
        <Txt ref={xCoordinate} y={-110} text={`X = ${coordinates.x}`} fontFamily={theme.font} fontSize={72} fontWeight={500} fill={theme.ink} />
        <Txt ref={yCoordinate} y={110} text={`Y = ${coordinates.y}`} fontFamily={theme.font} fontSize={72} fontWeight={500} fill={theme.ink} />
      </Node>
    </>,
  );

  yield* waitFor(6);
  xCoordinate().fontWeight(800);
  xCoordinate().scale(1.5);

  yield* waitFor(2);
  xCoordinate().fontWeight(500);
  xCoordinate().scale(1);
  yCoordinate().fontWeight(800);
  yCoordinate().scale(1.5);

  yield* waitFor(duration - 8);
});
