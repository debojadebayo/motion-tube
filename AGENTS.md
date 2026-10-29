# Project instructions

For a requested Motion Canvas animation, use the user-level `youtube-animation` skill at `~/.codex/skills/youtube-animation/SKILL.md`. This project uses a 1920×1080 Motion Canvas source, 60 fps preview, 3840×2160 at 30 fps export, and `#f5f5f5` for full-screen backgrounds. Keep any separate Swift renderer consistent with its Motion Canvas scene.

Only build an animation for a passage or idea the user has explicitly requested. Use the duration the user gives from Descript; if they have not given one, ask for it before building. Do not ask for audio or timestamps unless the user specifically requests synchronization to their recording.

Do not use computer or browser UI controls unless the user explicitly asks. Name every final video for its scene, never `project.mp4`.

Do not stage or commit changes unless the user explicitly asks. Building, rendering, verifying, and publishing an MP4 do not require a commit.

## Parallel worktrees and Descript exports

- Give each agent that writes scenes its own Git worktree. Keep its in-progress renders in that worktree's `output/` directory; agents must not render to the same file.
- After building and checking the final MP4, publish it to the primary checkout's `output/` directory with `scripts/publish-render.sh`. Run the publisher from the worktree that contains the rendered file:

  ```bash
  primary_checkout="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
  bash "$primary_checkout/scripts/publish-render.sh" "output/<scene-name>.mp4" "<scene-name>"
  ```

- Report the published absolute path to the user. That primary `output/` directory is the stable location for Descript imports. If the publisher reports a filename collision, use a new versioned scene name and publish again; preserve the earlier MP4.
- Worktrees contain separate files. Before starting agents in new worktrees, check that required project files and instructions are already available there. Do not stage or commit to synchronize worktrees without the user's explicit request.
