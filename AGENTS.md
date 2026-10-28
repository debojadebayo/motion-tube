# Project instructions

For a requested Motion Canvas animation, use the project skill at `.cursor/skills/youtube-animation/SKILL.md`.

Only build an animation for a passage or idea the user has explicitly requested. Use the duration the user gives from Descript; if they have not given one, ask for it before building. Do not ask for audio or timestamps unless the user specifically requests synchronization to their recording.

Do not use computer or browser UI controls unless the user explicitly asks. Name every final video for its scene, never `project.mp4`.

## Parallel worktrees and Descript exports

- Give each agent that writes scenes its own Git worktree. Keep its in-progress renders in that worktree's `output/` directory; agents must not render to the same file.
- After building and checking the final MP4, publish it to the primary checkout's `output/` directory with `scripts/publish-render.sh`. Run the publisher from the worktree that contains the rendered file:

  ```bash
  primary_checkout="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
  bash "$primary_checkout/scripts/publish-render.sh" "output/<scene-name>.mp4" "<scene-name>"
  ```

- Report the published absolute path to the user. That primary `output/` directory is the stable location for Descript imports. If the publisher reports a filename collision, use a new versioned scene name and publish again; preserve the earlier MP4.
- Worktrees contain separate files. Before starting agents in new worktrees, ensure the project files and these instructions are committed so each worktree receives them.
