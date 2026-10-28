---
name: youtube-animation
description: Create or revise Motion Canvas clips for this YouTube video project. Use when the user explicitly requests a new animation or a change to an existing one.
---

# YouTube animation

## Before creating a new scene

1. Identify the exact passage or visual idea the user requested. A script shared for context is not a request to animate every passage. Do not choose or build the next scene without an explicit request for that scene.
2. Use the duration the user provides from Descript. If no duration is given, ask for one before building. Do not require audio or timestamps when a duration is supplied.
3. If the user explicitly requests synchronization to their recording, ask for the audio or usable timestamps and align scene beats to it.

For an edit to an existing scene, use the new duration or beat positions the user gives. Ask only for timing information that is missing and necessary to make the requested edit.

## Build and export

- Read `README.md`, `src/project.ts`, `src/project.meta`, `src/theme.ts`, and a nearby scene before editing. Follow the established cartoon style; use `#f5f5f5` for full-screen scenes unless the user specifies otherwise. Keep overlays transparent when requested.
- Make one scene per requested insert and register it in `src/project.ts`. Keep its duration explicit and record its render range in `README.md`.
- Preview the important beats and inspect the actual frames. Check that labels are readable and that the scene communicates the requested idea without adding unrequested claims or captions.
- Run `pnpm build`. Render the scene at 3840×2160 and 30 fps using the project's Motion Canvas settings. Name the MP4 for its scene in `output/`. Restore the default range in `src/project.meta` after a scene-specific export.
- Verify the exported MP4's dimensions, frame rate, and duration with `ffprobe`; inspect at least an early, middle, and late frame. Report the file path and duration. Mention audio alignment only when the user asked for it.
- Do not use computer or browser UI controls unless the user explicitly asks. Use a command-line export route and give every final MP4 a descriptive scene name, never `project.mp4`.
- When an agent renders in a linked worktree, follow the publication command in `AGENTS.md` after verification. Give the user the published path in the primary checkout's `output/` directory.

For a batch, use low-resolution previews while refining motion and make final 4K exports after the scenes are approved. Preserve earlier exports when adding a new scene.
