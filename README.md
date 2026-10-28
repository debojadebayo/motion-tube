# YouTube inserts

Motion Canvas project for the short animations dropped into a YouTube edit: a full-frame chapter card, a lower third, and a callout. The frame is 1920×1080 at 60fps.

## Run the editor

```bash
pnpm install
pnpm start
```

Open http://localhost:9473. `pnpm serve` starts the same editor.

## How a project is laid out

`src/project.ts` lists the scenes in order. That array is the running order in the editor.

`src/scenes/` holds one file per scene. A scene is a generator function: it can pause and resume, and it receives a view you add shapes to.

Animation is a sequence of steps. You add a shape, then `yield*` an animation on it. The code reads top to bottom like a script. `yield* all(...)` is a single step where a few properties move together. `yield* waitFor(...)` holds before the exit.

The words for each insert are the constants at the top of the scene file. Change those, and the motion stays.

| Scene | File | What it is |
| --- | --- | --- |
| Chapter card | `src/scenes/title-card.tsx` | Full-frame card. It paints its own background. |
| Lower third | `src/scenes/lower-third.tsx` | Name and role over the footage, lower left. |
| Callout | `src/scenes/callout.tsx` | A short point that pops in above center. |

To add an insert, copy a scene file, then import it in `src/project.ts` and add it to `scenes`.

Colors and the Outfit typeface live in `src/theme.ts`.

## Drop a clip into the edit

The project background is transparent. In the editor, the lower third and callout sit on a checkerboard so you can see what will cover the footage. The chapter card fills the frame itself.

**Chapter card.** In Video Settings, keep the exporter on Video (FFmpeg), then render. The file lands in `output/` as an MP4 you can cut to.

**Lower third and callout.** The MP4 exporter flattens transparency, so an overlay exported that way comes out on black. For a real overlay, switch the exporter to Image sequence, set the file type to PNG, and render. Import that PNG sequence in Premiere, DaVinci Resolve, or Final Cut. The alpha channel is the part that covers the footage.

The lower third sits 96px in from the left and 120px up from the bottom, clear of the player controls.
