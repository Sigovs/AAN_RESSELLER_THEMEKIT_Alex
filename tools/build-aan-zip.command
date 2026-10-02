#!/bin/bash
# Double-click in Finder: builds the AAN review-server zip next to the project folder.
cd "$(dirname "$0")/.." || exit 1
python3 tools/build-aan-zip.py
echo
read -n 1 -s -r -p "Press any key to close"
