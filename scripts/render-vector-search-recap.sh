#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
render_output="${1:-output/vector-search-three-step-recap.mp4}"
mkdir -p "$(dirname "$render_output")"

ffmpeg -hide_banner -loglevel warning \
  -i src/videos/searching-100-million-vectors/assets/reused/words-to-embeddings.mp4 \
  -i src/videos/searching-100-million-vectors/assets/reused/document-neighbors.mp4 \
  -i src/videos/searching-100-million-vectors/assets/reused/hnsw-stacked-floors-v3.mp4 \
  -filter_complex '
    [0:v]trim=start_frame=0:end_frame=225,setpts=PTS-STARTPTS,format=yuv420p[v0];
    [1:v]trim=start_frame=0:end_frame=405,setpts=(PTS-STARTPTS)*240/405,fps=30,trim=end_frame=240,setpts=N/(30*TB),format=yuv420p[v1];
    [2:v]trim=start_frame=240:end_frame=630,setpts=(PTS-STARTPTS)*285/390,fps=30,trim=end_frame=285,setpts=N/(30*TB),format=yuv420p[v2];
    [v0][v1][v2]concat=n=3:v=1:a=0,format=yuv420p[out]
  ' \
  -map '[out]' -an -r 30 \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -movflags +faststart -y "$render_output"
