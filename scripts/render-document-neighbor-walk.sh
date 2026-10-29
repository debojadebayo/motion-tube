#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p output/.document-neighbor-walk-build

CLANG_MODULE_CACHE_PATH="$PWD/output/.document-neighbor-walk-build/clang-cache" \
SWIFT_MODULE_CACHE_PATH="$PWD/output/.document-neighbor-walk-build/swift-cache" \
  swiftc -O scripts/render-document-neighbor-walk.swift -o output/.document-neighbor-walk-build/renderer

output/.document-neighbor-walk-build/renderer | ffmpeg -v warning \
  -f rawvideo -pix_fmt bgra -s 1920x1080 -r 30 -i - \
  -vf scale=3840:2160:flags=lanczos \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -movflags +faststart -y output/document-neighbor-walk-doc3.mp4
