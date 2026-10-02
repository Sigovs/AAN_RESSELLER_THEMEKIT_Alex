# aan-review — the AAN server overlay

This branch is `main` plus three files that only the AAN review server gets:

| file | what it is |
|---|---|
| `pages/_aan-notes.js` | the team review-notes layer (append-only key, writes to mockupdb `aan-gen11`) |
| `comments.html` | the sheet that lists every note |
| `aan/index.html` | the AAN dashboard: Gen 11 only, with the robot; becomes `index.html` in the zip |

Nothing else lives here. `main` stays clean, without the notes tool.

Build the AAN zip from `main` with:

    python tools/build-aan-zip.py

The script takes the committed `main`, lays these three files over it,
adds the notes `<script>` tag to the ten Gen 11 pages, and keeps only
what those pages reach. The zip is written next to the repo folder.
