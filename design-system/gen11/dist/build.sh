#!/usr/bin/env bash
# Regenerate the distributable Gen 11 stylesheet from the source of truth.
#
# The source of truth is, and stays, the two shared files the ten shipped pages
# actually load. This script only concatenates them with a provenance header so
# a consumer can tell which commit the bundle was cut from. It never edits or
# "improves" the CSS — if the bundle and the sources disagree, the sources win
# and the bundle is stale.
#
#   usage:  bash design-system/gen11/dist/build.sh
#
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/../../.." && pwd)"
out="$here/aan-gen11.css"

family="$root/pages/_aan-family.css"
components="$root/pages/_aan-components.css"

for f in "$family" "$components"; do
  [ -f "$f" ] || { echo "missing source: $f" >&2; exit 1; }
done

sha="$(cd "$root" && git rev-parse HEAD 2>/dev/null || echo 'not a git checkout')"
short="$(cd "$root" && git rev-parse --short HEAD 2>/dev/null || echo '-------')"
dirty=""
if [ -n "$(cd "$root" && git status --porcelain -- pages/_aan-family.css pages/_aan-components.css 2>/dev/null)" ]; then
  dirty=" (WORKING TREE DIRTY — sources modified since that commit)"
fi
date_str="$(date +%Y-%m-%d)"

{
  printf '/*!\n'
  printf ' * AAN Gen 11 — distributable stylesheet\n'
  printf ' * GENERATED FILE. Do not edit by hand.\n'
  printf ' *\n'
  printf ' * Source of truth : pages/_aan-family.css + pages/_aan-components.css\n'
  printf ' * Generated from  : %s%s\n' "$sha" "$dirty"
  printf ' * Short           : %s\n' "$short"
  printf ' * Generated on    : %s\n' "$date_str"
  printf ' *\n'
  printf ' * Regenerate with : bash design-system/gen11/dist/build.sh\n'
  printf ' * If this file and the two source files disagree, the SOURCE wins and\n'
  printf ' * this file is stale — regenerate it rather than patching it.\n'
  printf ' */\n\n'

  printf '/* ====================================================================\n'
  printf '   PART 1 of 2 — pages/_aan-family.css\n'
  printf '   The family layer: what every AAN page shares regardless of archetype.\n'
  printf '   ==================================================================== */\n'
  cat "$family"

  printf '\n\n/* ==================================================================\n'
  printf '   PART 2 of 2 — pages/_aan-components.css\n'
  printf '   The component layer: the named ui-* components and the type roles.\n'
  printf '   Loads AFTER the family layer. Order is significant.\n'
  printf '   ================================================================== */\n'
  cat "$components"
} > "$out"

lines="$(wc -l < "$out" | tr -d ' ')"
echo "wrote $out"
echo "  from $short$dirty"
echo "  $lines lines"
