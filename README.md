# YouTube inserts

Motion Canvas project for short animations dropped into a YouTube edit: a Fortune 500 sign, a CEO speech, a paper-to-computer library, a words-to-embeddings transformation, a coordinate map, a semantic proximity graph, an embedding match, a search-scale comparison, a linear-work comparison, a friendship graph, a friendship route, a document-neighbor graph, a document-neighbor walk, a 50,000-document search, a Brixton-to-Enfield map, a full-frame chapter card, a lower third, and a callout. Scenes use a 1920×1080 canvas. The editor previews at 60 fps and renders at 3840×2160, 30 fps.

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

The words for each insert live in its scene file. Change the text there without changing the motion.

| Scene | File | What it is |
| --- | --- | --- |
| Fortune 500 sign | `src/scenes/fortune-500.tsx` | Full-frame cartoon sign that hops into view, holds, then exits. |
| CEO speech | `src/scenes/ceo-speech.tsx` | Full-frame cartoon CEO who gestures at a lectern. |
| Before and after library | `src/scenes/before-after-library.tsx` | Librarians build a paper library over years; documents then stream into an organized digital library. |
| Words to embeddings | `src/scenes/words-to-embeddings.tsx` | “customer churn” transforms into an illustrative numeric vector. |
| Map coordinates | `src/scenes/map-coordinates.tsx` | A map point with X and Y coordinates emphasized in turn. |
| Semantic proximity | `src/scenes/semantic-proximity.tsx` | Customer churn and client attrition sit close together; end-of-year party info is far away. |
| Embedding match | `src/scenes/embedding-match.tsx` | A question becomes an embedding and is compared with a list of example embeddings. |
| Search scale | `src/scenes/search-scale.tsx` | Compares the script's 100-million and 1-billion document search times. |
| Linear work | `src/scenes/linear-work.tsx` | Shows ten times the documents requiring ten times the work. |
| Friendship group | `src/scenes/friendship-group.tsx` | Turns a list of friends into a connected graph. |
| Friendship route | `src/scenes/friendship-route.tsx` | Adds You and traces You → Daniel → Femi → Emmanuel → Margaret in orange. |
| Document neighbors | `src/scenes/document-neighbors.tsx` | Moves a long document list into a sparse network of nearby neighbors. |
| Document neighbor walk | `src/scenes/document-neighbor-walk.tsx` | Starts at Doc 03 and checks nearby documents before stepping to Doc 05 and Doc 07. |
| 50,000 document search | `src/scenes/fifty-thousand-document-search.tsx` | Illustrates a question crossing a large document graph in about 900 jumps. |
| Brixton to Enfield | `src/scenes/brixton-enfield-restaurant.tsx` | Shows a mate's Nigerian restaurant recommendation and its location far north of Brixton. |
| Document 101 dead end | `src/scenes/document-101-dead-end.tsx` | Steps from Doc 02 to 27 to 43, then connects Doc 101 to Doc 43. |
| Document 57 local minimum | `src/scenes/document-57-local-minimum.tsx` | Reveals Doc 57 through a temporarily worse step and shows the better connection. |
| HNSW stacked floors | `src/scenes/hnsw-stacked-floors.tsx` | Turns one graph into nested floors: all documents on floor zero, fewer on each higher floor. |
| HNSW links by floor | `src/scenes/hnsw-links-by-floor.tsx` | Starts with tight floor-zero clusters, then shows sparser upper floors and longer links. |
| Three-step vector search recap | `src/scenes/vector-search-recap.tsx` | Reuses the embeddings, document graph, and text-free HNSW clips in a timed recap. |
| Chapter card | `src/scenes/title-card.tsx` | Full-frame card. It paints its own background. |
| Lower third | `src/scenes/lower-third.tsx` | Name and role over the footage, lower left. |
| Callout | `src/scenes/callout.tsx` | A short point that pops in above center. |

To add an insert, copy a scene file, then import it in `src/project.ts` and add it to `scenes`.

Shared colors and the Outfit typeface live in `src/theme.ts`. The Fortune 500 sign, CEO, library, embedding, map, semantic proximity, embedding match, search scale, linear work, friendship group, friendship route, document neighbors, document neighbor walk, 50,000-document search, and Brixton-to-Enfield scenes use an off-white `#f5f5f5` background.

## Drop a clip into the edit

The project background is transparent. In the editor, the lower third and callout sit on a checkerboard so you can see what will cover the footage. The Fortune 500 sign, CEO speech, library, embedding, map, semantic proximity, embedding match, search scale, linear work, friendship group, friendship route, document neighbors, document neighbor walk, 50,000-document search, Brixton-to-Enfield map, and chapter card scenes fill the frame themselves.

**Fortune 500 sign.** In Video Settings, set the range to preview frames 0 through 268, keep the exporter on Video (FFmpeg), and render. The MP4 lands in `output/`. Name the rendered file before rendering another scene. The sign clip has an off-white background, so you can use it as a full-screen cut in Descript.

**CEO speech.** Set the range to preview frames 270 through 568 and render with Video (FFmpeg). This produces a five-second, silent MP4 with an off-white background. The CEO wears a white shirt and black trousers beside the lectern. Add the speech audio in Descript.

**Before and after library.** Set the range to preview frames 570 through 1408 and render with Video (FFmpeg). The 14-second clip shows two librarians, including a darker-skinned woman, slowly building a paper library before documents flow into a computer and form a digital library.

**Words to embeddings.** Set the range to preview frames 1410 through 1888 and render with Video (FFmpeg). The 8-second clip holds “customer churn” until the transformation begins around 3.5 seconds, then shows example numeric values. The numbers are illustrative, not output from an embedding model.

**Map coordinates.** Set the range to preview frames 1890 through 2488 and render with Video (FFmpeg). The 10-second clip uses illustrative coordinates (4, 3). X becomes bold and 50% larger at 6 seconds; at 8 seconds X returns to normal while Y becomes bold and 50% larger.

**Semantic proximity.** Set the range to preview frames 2490 through 3088 and render with Video (FFmpeg). The 10-second clip places customer churn at 2 seconds, client attrition nearby at 3 seconds, and end-of-year party info far away at 9 seconds.

**Embedding match.** Set the range to preview frames 3090 through 3868 and render with Video (FFmpeg). The 13-second clip shows a list of example embeddings, a question-mark card at 4 seconds, the question's embedding at 6 seconds, and a comparison with the matching list item highlighted at 10 seconds. All numeric values are illustrative.

**Search scale.** Set the range to preview frames 3870 through 4408 and render with Video (FFmpeg). The nine-second clip shows 100 million documents for the first five seconds, then switches to one billion documents for the final four seconds.

**Linear work.** Set the range to preview frames 4410 through 4768 and render with Video (FFmpeg). The six-second clip grows one document and one work unit into ten matched pairs, then holds “10× DOCUMENTS” and “10× WORK.”

**Friendship group.** Set the range to preview frames 4770 through 5548 and render with Video (FFmpeg). The 13-second clip turns eight names, including Daniel, Femi, Margaret, and Emmanuel, from a list into circles starting at seven seconds, then draws varied friendship links. Daniel–Femi, Femi–Emmanuel, and Emmanuel–Margaret are ordinary links in this version; a later insert can highlight that route on the same graph.

The friendship clip also has a command-line renderer: run `bash scripts/render-friendship.sh` to create `output/friendship-group.mp4` without opening the editor.

**Friendship route.** Set the range to preview frames 5550 through 5998. The 7.5-second clip opens on the same eight-person network, adds a circle labelled “You,” then draws orange arrows through Daniel, Femi, Emmanuel, and Margaret. The completed route holds at the end. Run `bash scripts/render-friendship-route.sh` for a headless 3840×2160, 30 fps export to `output/friendship-route.mp4`.

**Document neighbors.** Set the range to preview frames 6000 through 6808. The 13.5-second clip moves ten document cards out of a long list into an irregular space, then adds sparse links between nearby documents. Run `bash scripts/render-document-neighbors.sh` for a headless 3840×2160, 30 fps export to `output/document-neighbors.mp4`.

**Document neighbor walk.** Set the range to preview frames 6810 through 7498. The 11.5-second clip starts at Doc 03, highlights its neighbors in teal, and steps to Doc 05 in burnt orange. At exactly 7 seconds, it checks Doc 05's neighbors and steps to Doc 07. Run `bash scripts/render-document-neighbor-walk.sh` for a headless 3840×2160, 30 fps export to `output/document-neighbor-walk-doc3.mp4`.

**50,000 document search.** Set the range to preview frames 7500 through 7918. The 7-second clip uses a dense illustrative document graph, a question, a highlighted route, and a counter ending at approximately 900 jumps. The visible nodes and route are a visual shorthand, not a literal rendering of all 50,000 documents or 900 steps. Run `bash scripts/render-fifty-thousand-document-search.sh` for a headless 3840×2160, 30 fps export to `output/fifty-thousand-document-search-v2.mp4`.

**Brixton to Enfield restaurant.** Set the range to preview frames 7920 through 8518. The 10-second clip shows a schematic London map, a mate's recommendation, then labels Enfield's Nigerian restaurant and the viewer's location in Brixton. The map is illustrative, not a street route. Run `bash scripts/render-brixton-enfield-restaurant.sh` for a headless 3840×2160, 30 fps export to `output/brixton-enfield-restaurant.mp4`.

**Document 101 dead end.** Set the range to preview frames 8520 through 10618. The 35-second clip introduces Doc 101, reveals Doc 02 at 7 seconds, Doc 27 at 10 seconds, and Doc 43 at 18 seconds. Each step is geometrically closer to Doc 101. At 22 seconds, Doc 43's farther neighbors make the local dead end visible; at 33 seconds, Doc 101 connects to Doc 43. Run `bash scripts/render-document-101-dead-end.sh` for a headless 3840×2160, 30 fps export to `output/document-101-dead-end-v3.mp4`.

**Document 57 local minimum.** Set the range to preview frames 10620 through 11308. The 11.5-second continuation begins with Doc 101 connected to Doc 43, reveals Doc 57 as a closer match at 2 seconds, and shows the alternative route through a temporarily farther document at 4.5 and 6.5 seconds. At 8.5 seconds, it shows the better Doc 57 connection and names the local minimum. Run `bash scripts/render-document-57-local-minimum.sh` for a headless 3840×2160, 30 fps export to `output/document-57-local-minimum-v2.mp4`.

**HNSW stacked floors.** Set the range to preview frames 11310 through 12568. The 21-second text-free clip begins with one two-dimensional graph. At 8 seconds, it becomes floor zero with every illustrative document. At 14 seconds, maximum heights are assigned and a sparser floor one appears; floor two follows at 17 seconds with fewer nodes and longer connections. Run `bash scripts/render-hnsw-stacked-floors.sh` for a headless 3840×2160, 30 fps export to `output/hnsw-stacked-floors-v3.mp4`.

**HNSW links by floor.** Set the range to preview frames 12570 through 13948. The 23-second text-free clip starts with twelve illustrative documents in three tight floor-zero clusters and connects each to a handful of nearby documents. Floor one appears at 11 seconds with six documents, floor two at 18 seconds with three, and floor three at 21 seconds with two. The horizontal links grow longer on each higher floor. Run `bash scripts/render-hnsw-links-by-floor.sh` for a headless 3840×2160, 30 fps export to `output/hnsw-links-by-floor-v2.mp4`.

**Three-step vector search recap.** Set the range to preview frames 13950 through 15448. The 25-second clip reuses `words-to-embeddings.mp4` for 0–7.5 seconds, compresses `document-neighbors.mp4` into 7.5–15.5 seconds, then uses the 8–21-second portion of the text-free `hnsw-stacked-floors-v3.mp4` for 15.5–25 seconds. The source scene uses Motion Canvas `Video` nodes; `scripts/render-vector-search-recap.sh` is the exact-frame headless export recipe. It creates `output/vector-search-three-step-recap.mp4` at 3840×2160, 30 fps.

**Chapter card.** Select its range in the timeline, keep the exporter on Video (FFmpeg), then render. The file lands in `output/` as an MP4 you can cut to.

**Lower third and callout.** The MP4 exporter flattens transparency, so an overlay exported that way comes out on black. For a real overlay, switch the exporter to Image sequence, set the file type to PNG, and render. Import that PNG sequence in Premiere, DaVinci Resolve, or Final Cut. The alpha channel is the part that covers the footage.

The lower third sits 96px in from the left and 120px up from the bottom, clear of the player controls.

## Parallel worktrees

Each worktree has its own `output/` directory. After verifying a render, agents use `scripts/publish-render.sh` to copy the named MP4 into this main checkout's `output/` directory, which is the stable folder for Descript imports. The publisher rejects a different file with the same name, so revisions get a versioned name.

Run `git worktree list` to see every worktree's path. In a terminal, use `cd /path/from/the/list` to enter one and `cd /Users/debo/github.com/debojadebayo/motion-tube` to return to this main checkout. Changing directory in one terminal does not move another agent out of its worktree. New worktrees start from committed files, so commit the project state before creating them.
