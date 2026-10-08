#!/usr/bin/env bash
# Cycle 49 koel — seed media: génère N fichiers MP3 réels (sine waves ffmpeg)
# avec tags ID3 artist/album/track dans $MEDIA_DIR (défaut ~/work/koel49-media).
# Rejouable : idempotent (les mêmes noms de fichiers), aucune dépendance API.
set -euo pipefail
MEDIA_DIR="${1:-$HOME/work/koel49-media}"
mkdir -p "$MEDIA_DIR"

# (artist, album, n_tracks, freq_base) — 3 artistes x 2 albums x 5 pistes
declare -a SPEC=(
  "Koel Rivers|Mornings Light|5|220"
  "Koel Rivers|Evenings Deep|5|262"
  "Blue Transistors|Analog Dreams|5|294"
  "Blue Transistors|Digital Ghosts|5|330"
  "Velvet Meridian|Midnight Signals|5|370"
  "Velvet Meridian|Solar Drift|5|415"
)

TITLES=("Intro" "First Light" "Wander" "Slow Burn" "Epilogue" "Echoes" "Drift" "Sustain" "Resolve" "Coda")
for entry in "${SPEC[@]}"; do
  IFS='|' read -r artist album n fbase <<<"$entry"
  dir="$MEDIA_DIR/$artist/$album"
  mkdir -p "$dir"
  for i in $(seq 1 "$n"); do
    title="${TITLES[$((i-1))]}"
    f="$dir/$(printf '%02d' "$i") - $title.mp3"
    [ -f "$f" ] && continue
    ffmpeg -hide_banner -loglevel error -y \
      -f lavfi -i "sine=frequency=$((fbase + i*20)):duration=45" \
      -f lavfi -i "sine=frequency=$((fbase/2)):duration=45" \
      -filter_complex "[0:a][1:a]amix=inputs=2:duration=shortest,volume=0.3" \
      -codec:a libmp3lame -q:a 5 \
      -metadata title="$title" -metadata artist="$artist" -metadata album="$album" \
      -metadata track="$i/$n" -metadata genre="Ambient" -metadata date="2024" \
      "$f"
  done
done
echo "SEED_MEDIA_DONE $(find "$MEDIA_DIR" -name '*.mp3' | wc -l) files in $MEDIA_DIR"
