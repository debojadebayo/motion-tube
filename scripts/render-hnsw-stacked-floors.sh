#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p output/.hnsw-stacked-floors-build

CLANG_MODULE_CACHE_PATH="$PWD/output/.hnsw-stacked-floors-build/clang-cache" \
SWIFT_MODULE_CACHE_PATH="$PWD/output/.hnsw-stacked-floors-build/swift-cache" \
  swiftc -O scripts/render-hnsw-stacked-floors.swift -o output/.hnsw-stacked-floors-build/renderer

output/.hnsw-stacked-floors-build/renderer | ffmpeg -v warning \
  -f rawvideo -pix_fmt bgra -s 1920x1080 -r 30 -i - \
  -vf scale=3840:2160:flags=lanczos \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -movflags +faststart -y output/hnsw-stacked-floors-v3.mp4
