#!/usr/bin/env bash
set -euo pipefail

fail() { printf 'publish-render: %s\n' "$*" >&2; exit 1; }

[[ $# -eq 2 || $# -eq 3 ]] || fail 'Usage: bash scripts/publish-render.sh <source-mp4> [video-slug] <scene-slug>'
source=$1
if [[ $# -eq 3 ]]; then
  video_slug=$2
  slug=$3
  [[ $video_slug =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || fail 'Video slug must contain lowercase letters or numbers separated by single hyphens.'
else
  slug=$2
fi
[[ $slug =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || fail 'Scene slug must contain lowercase letters or numbers separated by single hyphens.'
[[ $slug != project ]] || fail 'Use a scene name instead of project.'

worktree_root=$(git rev-parse --show-toplevel) || fail 'Run this command inside a Git worktree.'
common_dir=$(git -C "$worktree_root" rev-parse --path-format=absolute --git-common-dir)
primary_root=$(dirname "$common_dir")
[[ -f $source && -s $source ]] || fail 'Source must be a nonempty regular MP4 file.'
case $source in *.[mM][pP]4) ;; *) fail 'Source must have an .mp4 extension.' ;; esac
source=$(cd "$(dirname "$source")" && printf '%s/%s\n' "$(pwd -P)" "$(basename "$source")")

command -v ffprobe >/dev/null 2>&1 || fail 'ffprobe is required.'
probe=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,avg_frame_rate:format=format_name,duration \
  -of default=noprint_wrappers=1 "$source") || fail 'ffprobe could not read the source MP4.'
width= height= rate= format= duration=
while IFS='=' read -r key value; do
  case $key in
    width) width=$value ;;
    height) height=$value ;;
    avg_frame_rate) rate=$value ;;
    format_name) format=$value ;;
    duration) duration=$value ;;
  esac
done <<< "$probe"
case ,$format, in *,mp4,*) ;; *) fail 'Source must use an MP4 container.' ;; esac
[[ $width == 3840 && $height == 2160 ]] || fail 'Source must be 3840x2160.'
awk -v rate="$rate" -v duration="$duration" 'BEGIN {
  n = split(rate, parts, "/")
  if (n != 2 || parts[1] !~ /^[0-9]+$/ || parts[2] !~ /^[0-9]+$/ || parts[2] + 0 <= 0 || parts[1] / parts[2] != 30) exit 1
  if (duration !~ /^[0-9]+([.][0-9]+)?$/ || duration + 0 <= 0) exit 1
}' || fail 'Source must have a 30fps video stream and positive duration.'

output_dir="$primary_root/output"
if [[ $# -eq 3 ]]; then
  output_dir="$output_dir/$video_slug"
fi
destination="$output_dir/$slug.mp4"
if [[ -e $destination || -L $destination ]]; then
  [[ -f $destination ]] || fail "Destination is not a regular file: $destination"
  if [[ $source -ef $destination ]] || cmp -s "$source" "$destination"; then
    printf '%s\n' "$destination"
    exit 0
  fi
  fail "Destination already exists; use a new versioned scene slug: $destination"
fi

mkdir -p "$output_dir"
temp=$(mktemp "$output_dir/.publish-render.XXXXXX")
trap '[[ ! -e $temp ]] || rm -f "$temp"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP
cp "$source" "$temp"
mv -n "$temp" "$destination"
[[ ! -e $temp ]] || fail "Destination appeared during publication; use a new versioned scene slug: $destination"
printf '%s\n' "$destination"
