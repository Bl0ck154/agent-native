# Isolated Skill menu browser QA — 2026-11-07

Google Chrome headless, React 19, Radix DropdownMenu + AlertDialog.
This is an **isolated component reproduction**, **not** the full Agent-Native standalone Chat scaffold and not a claimed end-to-end fix of issue #8109.

Test sequence:
1. Open Settings / Personal Skills (fixture with a disposable skill).
2. Open More actions > Remove, confirm, unmount row while removal promise is pending.
3. Check body.style.pointerEvents, click a second Settings control.
4. Compare old DropdownMenu modal=true vs PR DropdownMenu modal=false.

Results (real browser output):
- Before: pointerEvents while menu open = none; after deletion = empty; next Settings control clicked.
- After: pointerEvents while menu open = empty; after deletion = empty; next Settings control clicked.
- No browser JavaScript errors.
- **The reported post-delete stale lock was not reproduced** by either fixture. Full-app browser verification remains necessary.

PNGs and result.json are unedited output of bounded browser QA. Source included.
