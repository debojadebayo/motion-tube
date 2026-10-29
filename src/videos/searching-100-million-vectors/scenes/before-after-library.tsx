import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  linear,
  sequence,
  waitFor,
} from '@motion-canvas/core';

import {loadFonts, theme} from '../../../shared/theme';

const background = '#f5f5f5';
const blue = '#799baf';
const gold = '#d9b46b';
const skin = '#f3c9a5';
const darkSkin = '#89583f';
const fileColors = [theme.accent, blue, gold];

function paper({x = 0, y = 0, color = theme.accent, scale = 1}: {
  x?: number;
  y?: number;
  color?: string;
  scale?: number;
}) {
  return (
    <Node x={x} y={y} scale={scale}>
      <Rect width={84} height={108} radius={10} fill={'#ffffff'} stroke={theme.ink} lineWidth={5} />
      <Rect x={-20} y={-28} width={15} height={19} radius={3} fill={color} />
      <Line points={[[-25, 7], [25, 7]]} stroke={theme.ink} lineWidth={5} lineCap={'round'} />
      <Line points={[[-25, 26], [13, 26]]} stroke={theme.ink} lineWidth={5} lineCap={'round'} />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  const heading = createRef<Txt>();
  const before = createRef<Node>();
  const after = createRef<Node>();
  const yearNumber = createRef<Txt>();
  const calendar = createRef<Node>();
  const paperPile = createRef<Node>();
  const slowPaper = createRef<Node>();
  const monitor = createRef<Node>();
  const source = createRef<Node>();
  const workerArms = [createRef<Node>(), createRef<Node>()];
  const digitalFiles = Array.from({length: 9}, () => createRef<Node>());
  const incomingPapers = Array.from({length: 24}, () => createRef<Node>());

  view.fill(background);
  yield* loadFonts();

  view.add(
    <>
      <Line points={[[-825, 420], [825, 420]]} stroke={theme.ink} lineWidth={5} opacity={0.17} lineCap={'round'} />
      <Txt
        ref={heading}
        y={-420}
        text={'BEFORE COMPUTERS'}
        fontFamily={theme.font}
        fontSize={66}
        fontWeight={800}
        letterSpacing={3}
        fill={theme.ink}
        opacity={0}
      />

      <Node ref={before} y={45} opacity={0}>
        <Node x={425} y={75}>
          <Rect width={680} height={555} radius={22} fill={theme.paper} stroke={theme.ink} lineWidth={8} />
          {[-150, 5, 160].map((shelfY, row) => (
            <Node y={shelfY}>
              {Array.from({length: 12}, (_, column) => {
                const height = 86 + ((column * 17 + row * 23) % 44);
                return (
                  <Node x={-286 + column * 52} y={-height / 2} rotation={column === 2 ? -5 : column === 9 ? 5 : 0}>
                    <Rect width={43} height={height} radius={5} fill={fileColors[(column + row) % fileColors.length]} stroke={theme.ink} lineWidth={4} />
                    <Line points={[[-13, -height / 2 + 17], [13, -height / 2 + 17]]} stroke={theme.paper} lineWidth={5} opacity={0.85} />
                    <Line points={[[-13, height / 2 - 17], [13, height / 2 - 17]]} stroke={theme.paper} lineWidth={5} opacity={0.85} />
                  </Node>
                );
              })}
              <Rect y={9} width={632} height={18} radius={5} fill={theme.ink} />
            </Node>
          ))}
          <Rect x={-260} y={315} width={30} height={80} radius={8} fill={theme.ink} />
          <Rect x={260} y={315} width={30} height={80} radius={8} fill={theme.ink} />
        </Node>

        <Node ref={calendar} x={-390} y={-235}>
          <Rect width={200} height={175} radius={18} fill={'#ffffff'} stroke={theme.ink} lineWidth={6} />
          <Rect y={-65} width={200} height={45} radius={[15, 15, 0, 0]} fill={theme.accent} />
          <Line points={[[-52, -102], [-52, -70]]} stroke={theme.ink} lineWidth={10} lineCap={'round'} />
          <Line points={[[52, -102], [52, -70]]} stroke={theme.ink} lineWidth={10} lineCap={'round'} />
          <Txt y={-14} text={'YEAR'} fontFamily={theme.font} fontSize={30} fontWeight={700} fill={theme.ink} />
          <Txt ref={yearNumber} y={40} text={'1'} fontFamily={theme.font} fontSize={64} fontWeight={800} fill={theme.ink} />
        </Node>

        {workerArms.map((arm, index) => (
          <Node x={-555 + index * 290} y={105}>
            <Circle y={303} width={170} height={20} fill={theme.ink} opacity={0.12} />
            <Line points={[[-31, 105], [-31, 279]]} stroke={theme.ink} lineWidth={29} lineCap={'round'} />
            <Line points={[[31, 105], [31, 279]]} stroke={theme.ink} lineWidth={29} lineCap={'round'} />
            <Rect x={-42} y={288} width={70} height={25} radius={12} fill={theme.accent} />
            <Rect x={42} y={288} width={70} height={25} radius={12} fill={theme.accent} />
            <Rect y={27} width={130} height={170} radius={32} fill={index === 0 ? '#ffffff' : blue} stroke={theme.ink} lineWidth={6} />
            <Rect y={-70} width={30} height={35} radius={8} fill={index === 0 ? skin : darkSkin} stroke={theme.ink} lineWidth={4} />
            <Node y={-132}>
              {index === 1 && (
                <>
                  <Circle x={43} y={-44} size={65} fill={theme.ink} />
                  <Circle y={-10} width={112} height={132} fill={theme.ink} />
                </>
              )}
              <Circle width={98} height={113} fill={index === 0 ? skin : darkSkin} stroke={theme.ink} lineWidth={6} />
              {index === 1 && (
                <>
                  <Circle x={-29} y={-48} width={69} height={37} fill={theme.ink} />
                  <Circle x={19} y={-51} width={72} height={33} fill={theme.ink} />
                </>
              )}
              <Circle x={-23} y={-4} size={29} stroke={theme.ink} lineWidth={4} />
              <Circle x={23} y={-4} size={29} stroke={theme.ink} lineWidth={4} />
              <Line points={[[-8, -4], [8, -4]]} stroke={theme.ink} lineWidth={4} />
              <Circle x={-23} y={-4} size={6} fill={theme.ink} />
              <Circle x={23} y={-4} size={6} fill={theme.ink} />
              <Line points={[[-12, 30], [12, 30]]} stroke={theme.ink} lineWidth={5} lineCap={'round'} />
            </Node>
            <Node ref={arm} x={60} y={-12} rotation={-24}>
              <Line points={[[0, 0], [21, 58], [-1, 97]]} stroke={theme.ink} lineWidth={24} lineJoin={'round'} lineCap={'round'} />
              <Circle x={-1} y={97} size={29} fill={index === 0 ? skin : darkSkin} stroke={theme.ink} lineWidth={4} />
            </Node>
            <Line points={[[-63, -11], [-82, 53], [-61, 99]]} stroke={theme.ink} lineWidth={24} lineJoin={'round'} lineCap={'round'} />
            <Circle x={-61} y={99} size={29} fill={index === 0 ? skin : darkSkin} stroke={theme.ink} lineWidth={4} />
          </Node>
        ))}

        <Node x={-415} y={225}>
          <Rect x={-288} y={88} width={30} height={200} radius={8} fill={theme.ink} />
          <Rect x={288} y={88} width={30} height={200} radius={8} fill={theme.ink} />
          <Rect width={705} height={32} radius={12} fill={gold} stroke={theme.ink} lineWidth={6} />
        </Node>

        <Node ref={paperPile} x={-740} y={209} scaleY={0.65}>
          {Array.from({length: 12}, (_, index) => (
            <Rect x={index % 2 === 0 ? -4 : 4} y={-index * 17} width={137} height={20} radius={4} fill={'#ffffff'} stroke={theme.ink} lineWidth={3} />
          ))}
        </Node>
        {paper({x: -405, y: 192, scale: 0.6})}
        {paper({x: -135, y: 192, color: blue, scale: 0.6})}
        <Node ref={slowPaper} opacity={0}>{paper({})}</Node>
      </Node>

      <Node ref={after} opacity={0} scale={0.9}>
        <Node ref={source} x={-710} y={20}>
          <Circle y={305} width={255} height={25} fill={theme.ink} opacity={0.1} />
          <Node rotation={-13}>{paper({x: -40, y: 28, color: blue, scale: 1.6})}</Node>
          <Node rotation={10}>{paper({x: 25, y: -18, color: gold, scale: 1.6})}</Node>
          {paper({x: 0, y: 12, scale: 1.6})}
          <Line points={[[160, -13], [239, -13]]} stroke={theme.accent} lineWidth={10} lineCap={'round'} endArrow arrowSize={20} />
          <Line points={[[130, 33], [198, 33]]} stroke={theme.accent} lineWidth={7} lineCap={'round'} opacity={0.5} />
        </Node>

        <Node ref={monitor} x={275} y={20}>
          <Circle y={394} width={860} height={34} fill={theme.ink} opacity={0.12} />
          <Rect y={335} width={130} height={135} radius={18} fill={blue} stroke={theme.ink} lineWidth={7} />
          <Rect y={390} width={410} height={34} radius={17} fill={theme.ink} />
          <Rect width={1030} height={605} radius={38} fill={theme.ink} />
          <Rect y={-14} width={956} height={515} radius={20} fill={'#ffffff'} />
          <Circle y={280} size={14} fill={theme.accent} />
          {digitalFiles.map((file, index) => (
            <Node ref={file} x={-290 + (index % 3) * 290} y={-173 + Math.floor(index / 3) * 125} opacity={0} scale={0.8}>
              <Rect x={-65} y={-40} width={87} height={28} radius={[9, 9, 0, 0]} fill={fileColors[index % 3]} stroke={theme.ink} lineWidth={4} />
              <Rect width={238} height={91} radius={12} fill={fileColors[index % 3]} stroke={theme.ink} lineWidth={4} />
              <Rect x={-65} width={37} height={49} radius={5} fill={'#ffffff'} stroke={theme.ink} lineWidth={3} />
              <Line points={[[-7, -9], [85, -9]]} stroke={theme.ink} lineWidth={6} lineCap={'round'} />
              <Line points={[[-7, 12], [57, 12]]} stroke={theme.ink} lineWidth={6} lineCap={'round'} />
            </Node>
          ))}
          <Txt y={216} text={'DIGITAL LIBRARY'} fontFamily={theme.font} fontSize={35} fontWeight={800} letterSpacing={3} fill={theme.ink} />
        </Node>

        {incomingPapers.map((incoming, index) => (
          <Node ref={incoming} opacity={0}>{paper({color: fileColors[index % 3], scale: 0.82})}</Node>
        ))}
      </Node>
    </>,
  );

  yield* all(
    before().opacity(1, 0.6),
    before().y(0, 0.6, easeOutCubic),
    heading().opacity(1, 0.6),
  );

  for (let year = 1; year <= 3; year++) {
    yearNumber().text(`${year}`);
    slowPaper().position([-420, 178]);
    slowPaper().rotation(-15);
    slowPaper().opacity(0);
    yield* all(
      ...workerArms.map((arm, index) =>
        arm().rotation(-52 - index * 8, 0.35, easeInOutCubic)
          .to(-16, 0.35, easeInOutCubic)
          .to(-52 - index * 8, 0.35, easeInOutCubic)
          .to(-24, 0.35, easeInOutCubic),
      ),
      slowPaper().x(360, 1.4, easeInOutCubic),
      slowPaper().y(-110, 1.4, easeInOutCubic),
      slowPaper().rotation(0, 1.4, easeInOutCubic),
      slowPaper().opacity(1, 0.15).wait(1.05).to(0, 0.2),
      paperPile().scale.y(0.65 + year * 0.2, 1.4, easeInOutCubic),
      calendar().rotation(-4, 0.15).to(4, 0.15).to(0, 0.25),
    );
  }

  yield* waitFor(1.2);
  yield* all(
    before().x(-150, 0.8, easeInCubic),
    before().opacity(0, 0.65),
    heading().opacity(0, 0.35),
  );
  heading().text('WITH COMPUTERS');
  yield* all(
    after().opacity(1, 0.6),
    after().scale(1, 0.6, easeOutBack),
    heading().opacity(1, 0.6),
  );

  yield* all(
    sequence(
      0.08,
      ...incomingPapers.map((incoming, index) => (function* () {
        incoming().position([-700 - (index % 3) * 15, -130 + (index % 5) * 60]);
        incoming().rotation(-18 + (index % 4) * 12);
        yield* all(
          incoming().x(-100, 0.6, linear),
          incoming().y(-40 + (index % 3) * 40, 0.6, easeInOutCubic),
          incoming().rotation(0, 0.6, easeOutCubic),
          incoming().scale(0.65, 0.6),
          incoming().opacity(1, 0.08).wait(0.42).to(0, 0.1),
        );
      })()),
    ),
    sequence(
      0.245,
      ...digitalFiles.map(file => all(
        file().opacity(1, 0.48),
        file().scale(1, 0.48, easeOutBack),
      )),
    ),
    source().rotation(-3, 0.61).to(3, 0.61).to(-3, 0.61).to(0, 0.61),
  );

  yield* all(
    source().opacity(0, 0.56),
    monitor().x(0, 0.56, easeInOutCubic),
  );
  yield* waitFor(3.6);
});
