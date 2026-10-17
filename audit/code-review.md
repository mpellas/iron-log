# 90Strong (mpellas/iron-log) code review: HEAD 9db6725

**Commit reviewed:** `9db6725` "Fix 3 HIGH audit items from 363c44b audit" (Oct 17, 2026, 5:14 AM PT). It changes `index.html` only (+60 / −30 against `9af9f25`). The only other commit since `363c44b` is `9af9f25`, which adds `audit/README.md`.

**Live Pages matches HEAD.** The SHA-256 of https://mpellas.github.io/iron-log/ is identical to HEAD's `index.html` (`fec28422…`). Last-Modified is Oct 17, 5:15 AM PT.

**Scope:** read-only, no AI calls, nothing changed in the repo. Line numbers refer to `index.html` at HEAD. The JSX block parses cleanly (checked with @babel/parser).

## The 3 HIGH fixes

| Audit # | Fix | Verdict | Evidence |
|---|---|---|---|
| 3 | Deloads no longer cancelled | **Correct** | The clamp in `parseEx` that raised a lower AI weight to the last peak is gone (lines 2536–2539). `SetRow` now uses `effFloor = min(last peak, AI target)` for the orange "below last" hint (lines 1227–1228, 1277–1278, 1336). A planned deload now reaches the hint, the AI TARGET line and the ✓ fill. Small nit: the hint still says "below last: Xlb" when X is the AI target. |
| 2 | Cleared bodyweight no longer lingers | **Correct** | `saveProfile` removes `ironlog:bodyweight` when bodyweight is 0, blank or NaN (lines 157–159). The BW button now goes through `saveProfile`, and a blank entry clears it (lines 2407–2415). The assisted-load math (line 1313) and the AI progression data (line 2622) read that key, so a stale value can't reach the AI any more. |
| 1 | Plank / timed rows | **Partly correct** | Correct: a timed row shows "AI TARGET: N seconds" instead of "N reps bodyweight" (lines 1561–1574). ✓ now fills a blank timed row's seconds (line 1464). Plank can't get `reps` any more, so new saves no longer produce "No data logged". The save warning now names any exercises it drops (lines 2474, 2480–2488). Gaps: see new issues 1–3 below. |

## New issues from this commit

1. **Mountain Climbers ✓ fills the MIN field with seconds.** It is in both `TIMED_EXERCISES` (line 821) and `CARDIO_EXERCISES` (line 840), and `parseEx` forces it to Cardio (line 2520). `SetRow` renders the cardio MIN row (line 1262), but `confirmSet` checks `isTimed` first (line 1464) and writes the seconds target, such as 45, into the minutes field. History then shows "45min" (line 1647). It also shows "AI TARGET: 45 seconds" above a MIN box.
2. **Cardio ✓ copies `aiReps` straight into minutes** (line 1466). For cardio, `aiReps` is a rep count or seconds, never minutes. A Burpees target of "15" fills 15 min. There is no AI TARGET line for cardio, so the user can't see what the ✓ will fill.
3. **Finisher rows still don't fill.** The finisher JSON gives `"duration":"40 sec"` and no `reps` (line 2829). `parseEx` only reads `ex.reps` (line 2531), so finisher Plank, Jump Rope and similar rows get no target, and ✓ still does nothing on them.
4. **Possible bodyweight loss when importing an old backup.** `importData` saves the backup's bodyweight (line 97), then `saveProfile(merged)` (line 114). If the backup's profile has no `bodyweight`, the default 0 now deletes the key that was just imported. Low risk, since current exports include it.
5. The timed row's seconds box still uses the placeholder "sec", not "e.g. 45" (line 1305). Minor.

## Prior open items

| Item | Status | Evidence |
|---|---|---|
| Cleared weight saves "– × N" | **Still open** | `hasAnyData`'s reps-only rule (line 2451) still accepts reps with an empty weight on any exercise. Fix: use that rule only for `BODYWEIGHT_EXERCISES`. |
| Save warning counts copied marker | **Partly fixed** | The wording now says "N sets with only copied or partial values", which is accurate for untouched copies. `beforeNonEmpty` (line 2463) still counts a `_pending:false` key, so a row that was typed in and then fully cleared still counts as a dropped set. |
| LAST line "R—×—" | **Still open** | `getLastLoggedDetail` fills a missing side with "—" (line 454), and the LAST renderer treats "—" as data (line 1560). |
| Half-filled L/R set: no warning | **Still open** | `stripIncompleteSide` (lines 2465–2471) silently drops the empty side. The set still counts as complete, so no warning fires. |
| ADD SET on a blank row is silent | **Still open** | A silent `return` (line 1433). |
| ✓ on a blank row with no target is silent | **Still open** | Returns the row unchanged, with no message or focus (line 1460). |
| ✓ on cardio / timed rows | **Partly fixed** | Timed superset rows fill now. Cardio fills with the wrong unit, and finisher rows don't fill (new issues 1–3). Rung and level rows still don't fill (line 1468). |
| Plank target in reps / "No data logged" | **Fixed** for new saves | See HIGH #1. Old history entries saved that way still show "No data logged". |
| Cleared bodyweight keeps old value | **Fixed** | See HIGH #2. Note: the "180" a tester saw on a clean start is the field's placeholder, "e.g. 180" (line 1116), not a stored value. |
| BW button says just "BW" | **Still open** | Line 2900, 10px font. |
| Deload clamp | **Fixed** | See HIGH #3. |
| Time budget vs "5 pairs" | **Still open** | The budget line asks for 3/4/5 pairs (line 206), but the rules still say "SUPERSETS (5 pairs" (line 2778) and "Exactly ONE of the 5 superset pairs" (line 2818). |
| Fixed finisher length | **Still open** | Fixed at 10/15 min (lines 2823, 2829). The budget line asks for fewer finisher exercises, but the header still says 10/15 min. |
| EST ignores budget | **Still open** | Line 2951. |
| Bike vs Stationary Bike | **Still open** | "Bike" in the exercise list (line 744) vs "Stationary Bike" in the equipment list (lines 304, 1952). Both kept on purpose for filtering (lines 518–521). |
| Grip strength / Arm length | **Still open** | Profile lines 1129 and 1138, and prompt lines 189–202. |
| Arc Trainer | **Still open** | Lines 749 and 1952. |
| API key in plain text | **Still open** | `localStorage "ironlog:apikey"` (lines 211, 229), plus in-browser Babel (line 27). |

## Suggested next fixes, in order

1. In `confirmSet`, check `isCardio` before `isTimed`, and don't fill minutes from `aiReps`. Or convert seconds to minutes, and show a cardio target line.
2. In `parseEx`, read `ex.duration` when `ex.reps` is missing, so finisher rows get a target.
3. Apply the reps-only save rule only to bodyweight exercises (line 2451).
4. Warn when a left/right set has one side blank, and fix the "R—×—" LAST line.
5. Make the pair count and finisher length follow the time budget.
