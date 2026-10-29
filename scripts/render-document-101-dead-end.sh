#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
render_output="${1:-output/document-101-dead-end-v3.mp4}"
mkdir -p "$(dirname "$render_output")"
mkdir -p output/.document-101-dead-end-build

CLANG_MODULE_CACHE_PATH="$PWD/output/.document-101-dead-end-build/clang-cache" \
SWIFT_MODULE_CACHE_PATH="$PWD/output/.document-101-dead-end-build/swift-cache" \
  swiftc -O src/videos/searching-100-million-vectors/renderers/render-document-101-dead-end.swift -o output/.document-101-dead-end-build/renderer

output/.document-101-dead-end-build/renderer | ffmpeg -v warning \
  -f rawvideo -pix_fmt bgra -s 1920x1080 -r 30 -i - \
  -vf scale=3840:2160:flags=lanczos \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -movflags +faststart -y "$render_output"
