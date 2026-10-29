# Motion Tube

Short animations for YouTube edits. Each video has its own Motion Canvas project under `src/videos/<video-slug>/`. The current video is [Searching 100 Million Vectors](src/videos/searching-100-million-vectors/). Shared colors and type are in `src/shared/theme.ts`.

## Start a video

```bash
pnpm new:video -- my-video-name
pnpm start
```

The command creates `project.ts`, `project.meta`, `video.json`, and empty `scenes/`, `assets/`, and `renderers/` directories. The editor lists each video's project separately. Add scenes to that video's `project.ts` after agreeing their durations from Descript. Keep scene assets and any dedicated renderers inside the same video folder. A new video starts with the existing 1920×1080 canvas, 60 fps preview, and 3840×2160 at 30 fps export settings.

## Render and import

For a scene with a command-line renderer listed in its `video.json`:

```bash
pnpm render -- searching-100-million-vectors friendship-group
```

This renders, checks the 4K/30 fps format and scene duration, then publishes `output/searching-100-million-vectors/friendship-group.mp4` for Descript. Pass a third slug for a revision, for example `friendship-group-v2`; an existing export is never silently replaced. Scenes without a command-line renderer are exported from the Motion Canvas editor. Publish an editor export with:

```bash
bash scripts/publish-render.sh path/to/render.mp4 my-video-name scene-name
```

Existing MP4s directly under `output/` stay at their original paths for Descript imports. They are ignored by Git. The current video's recap source MP4s are tracked under `assets/reused/`, so a fresh checkout can build it. The older, video-specific scene notes and transcript are in the current video's folder; old preview frame ranges in `legacy-notes.md` are historical because scene durations can shift later ranges.

## Parallel worktrees

Each worktree renders in its own workspace. `publish-render.sh` copies a checked export to the primary checkout's `output/<video-slug>/` directory. Check `git worktree list` to find the checkout paths. Do not stage or commit unless asked.
