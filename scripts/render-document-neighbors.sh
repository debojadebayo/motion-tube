#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
render_output="${1:-output/document-neighbors.mp4}"
mkdir -p "$(dirname "$render_output")"
mkdir -p output/.document-neighbors-build

CLANG_MODULE_CACHE_PATH="$PWD/output/.document-neighbors-build/clang-cache" \
SWIFT_MODULE_CACHE_PATH="$PWD/output/.document-neighbors-build/swift-cache" \
  swiftc -O src/videos/searching-100-million-vectors/renderers/render-document-neighbors.swift -o output/.document-neighbors-build/renderer

output/.document-neighbors-build/renderer | ffmpeg -v warning \
  -f rawvideo -pix_fmt bgra -s 1920x1080 -r 30 -i - \
  -vf scale=3840:2160:flags=lanczos \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -movflags +faststart -y "$render_output"
