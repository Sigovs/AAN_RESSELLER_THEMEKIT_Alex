# Gen 11 — where we stopped (20 Nov 2026)

Read this first when continuing on another machine. It is the state of the
work, not a spec. Later notes go at the bottom; replace this file when the
state changes.

## Branches

- `handoff` — the working branch: handover folder, test pages, DS pass.
  Last commit: "Handover page: steps flattened (no cards inside the sheet)".
- `round2-v3` — the sl11 build (no `handoff/` folder). Unchanged in this session.
- Both are pushed to origin (Sigovs). `main` is not where the work is.
- Start: `git fetch && git checkout handoff && git pull`.

## Live links

- Handover page (the one link for the developers):
  https://sigovs.github.io/aan-gen11-v3-preview/handoff/
- Its source: `handoff/index.html` on `handoff`. The preview site is a
  separate repo (`Sigovs/aan-gen11-v3-preview`), filled with
  `git archive handoff <paths> | tar -x` into a clone, then commit + push.
- sl11 carries the DS-pass build (Alex uploaded it himself).

## Done this session

1. Feed Groups editor stays a page view, not a modal (Alex chose A).
   The head is not lifted: head and zone geometry are shared with Dealer Edit.
2. Sales Report test page: dealer names in tiles are shown as written
   (`tile__k--name`), not in caps. Caps only on keys; data is never transformed.
3. `handoff/README.md` and `handoff/rules-and-backend.html`: no open design
   decision; field heights decided (36 in a form, 30 in a dense working form);
   the seven test pages linked as worked examples, not a source of values.
   Zip rebuilt (`python tools/ds-check/handoff-zip.py`).
4. New `handoff/index.html`: one page with Start here (README, zip,
   design system, 10 screens), 01 steps, 02 where things live, 03 the
   10 reference screens in precedence order, 04 the 7 sample pages,
   05 questions and new features, 06 known limits. Thumbnails in
   `handoff/start/`.
5. Step cards on that page flattened (they were cards inside the sheet).
   The four board tiles stay: that is the DS board pattern.

## Verified

`node tools/ds-check/handover-check.mjs` (add `shots` for PNGs): overflow 0,
no low-contrast text, no clipped titles, no console errors at
1920/1440/1024/768/390. "brokenImgs" at 768/390 are lazy images that headless
has not loaded yet, not broken files (all links and images return 200 live).

## Done 20 Nov

6. Backend classes checked on the live backend (read only): every class in
   `aan-gen11-components.css` exists; nine were seen only in the backend's
   styleguide or CSS and are listed in the file's header. README, the page's
   Known limits and the zip updated.
7. Handover page: an "Inside:" line under Rules and backend map links straight
   to its levels (Rules, Tokens, Atoms, Molecules, Organisms, Templates,
   Pages, Before you hand in a screen).
8. Handover page: fifth Start-here tile (7 samples); the design system is
   chapter 01 with two page previews; the catalog row was dropped
   (catalog.html only redirects to rules-and-backend.html).
9. Alex: ready to hand over; he sends the page link himself.

## Open
- Optional: capture the real backend Feed Groups modal on the new backend
  (needs Alex logged in in Chrome; never enter passwords; read only).
- The email to Alex with the hand-over links was not sent (no mail
  connector in that session).

## Standing rules

- Facelift only: anything new is commented out, never deleted, and goes to
  New features after go-live.
- Nothing jumps; AA contrast on the rendered page; no horizontal scroll;
  no modals; one component = one geometry; caps only on keys.
- Review notes one at a time: one change, show it, wait for Alex.
- Do not upload to sl11 — Alex uploads. Push `handoff` and `round2-v3`
  after every commit as the backup.
- No secrets, IPs, passwords or client people's names on public pages.
  `alex-db.md` is gitignored and stays local.
- Answers to Alex in Russian.
