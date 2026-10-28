#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p output

CLANG_MODULE_CACHE_PATH=/tmp/motion-tube-clang-cache \
SWIFT_MODULE_CACHE_PATH=/tmp/motion-tube-swift-cache \
  swiftc -O scripts/render-friendship.swift -o /tmp/render-friendship

/tmp/render-friendship | ffmpeg -v warning \
  -f rawvideo -pix_fmt bgra -s 1920x1080 -r 30 -i - \
  -vf scale=3840:2160:flags=lanczos \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -movflags +faststart -y output/friendship-group.mp4
