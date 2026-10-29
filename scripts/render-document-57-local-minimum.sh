#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p output/.document-57-local-minimum-build

CLANG_MODULE_CACHE_PATH="$PWD/output/.document-57-local-minimum-build/clang-cache" \
SWIFT_MODULE_CACHE_PATH="$PWD/output/.document-57-local-minimum-build/swift-cache" \
  swiftc -O scripts/render-document-57-local-minimum.swift -o output/.document-57-local-minimum-build/renderer

output/.document-57-local-minimum-build/renderer | ffmpeg -v warning \
  -f rawvideo -pix_fmt bgra -s 1920x1080 -r 30 -i - \
  -vf scale=3840:2160:flags=lanczos \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -movflags +faststart -y output/document-57-local-minimum-v2.mp4
