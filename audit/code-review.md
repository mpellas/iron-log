# 90Strong (mpellas/iron-log) code review: HEAD 54e8ceb

**Commit reviewed:** `54e8ceb` "Fix 14 items from the 9db6725 audit" (Oct 18, 2026, 6:22 AM PT). App change is `index.html` only (+132 / −68 vs `9db6725`).

**Live Pages matches HEAD.** SHA-256 of https://mpellas.github.io/iron-log/ equals HEAD `index.html` (`7909b335…`). Last-Modified Oct 18, 6:22 AM PT.

**Scope:** read-only code review, no AI calls. Line numbers refer to `index.html` at `54e8ceb`.

## New HIGH regression

1. **Bodyweight sets with reps only are now dropped at save.** The new rule in `hasAnyData` (line 2478) only accepts reps-only sets when `s.weight===undefined`. But bodyweight exercises (Push-Ups, Pull-Ups, etc.) get `{weight:"",reps:""}` from both `blankSet` (line 1428) and `parseEx` (line 2596), since neither has a bodyweight branch. So a Push-Up set with "12" reps fails the check, is listed as a "partial set" in the warning, and is not saved. Fix: allow reps-only when `BODYWEIGHT_EXERCISES.has(ex.name)` (or give bodyweight a `{reps}` set shape), instead of keying on the `weight` key.

## Claimed fixes

| # | Fix | Verdict | Evidence |
|---|---|---|---|
| 1 | ✓ no longer fills cardio | **Partly** | Pure cardio rows no longer fill (line 1480). But Mountain Climbers is still in both `TIMED_EXERCISES` (835) and `CARDIO_EXERCISES` (854). `confirmSet` checks `isTimed` first (line 1479), so ✓ still puts the seconds target into its MIN box. |
| 2 | Finisher `duration` read | **Fixed** | `parseEx` falls back to `ex.duration` (line 2567). Finisher Plank/Jump Rope now get a target. ✓ still won't fill Jump Rope (cardio, by design). |
| 3 | Cleared weight saves "– × N" | **Fixed, but caused the regression above** | Line 2478. |
| 4 | Half-filled L/R warning | **Fixed (inline)** | Orange "right side empty — will save single-side" (lines 1293–1298, 1309). Save still strips silently. |
| 5 | ✓ / ADD SET on blank row | **Fixed** | `window.alert` messages (lines 1446, 1465). Alerts are blocking on a phone; a toast would be nicer. |
| 6 | Save warning names sets | **Fixed** | Names "Exercise set N" (lines 2507–2516); fully cleared rows no longer counted. |
| 7 | Deload "below last" | **Fixed** | `matchesAi` suppresses the hint when weight equals the AI target (lines 1226, 1290, 1342). Wording still "below last: Xlb" when the hint does fire under a deload. |
| 8 | Time budget | **Fixed** | Pair count, finisher minutes and exercise count follow the budget (lines 2819–2822, 2827, 2866, 2872–2876). EST shows "/ BUDGET" and turns orange when over (lines 2996–3006). |
| 9 | Cardio LAST line | **Fixed** | Cardio history renders "15min · lv5 · 140cal" (lines 466–470, 1576). Jump Rope no longer "new exercise". |
| 10 | Gym-type cardio re-prune | **Fixed** | `useEffect` on `profile.gymType` (lines 2196–2200). |
| 11 | Bike naming | **Fixed** | "Bike" everywhere; legacy "Stationary Bike" normalized on load (line 296). |
| 12 | Sizes / BW button | **Mostly fixed** | BW shows "180 BW", "BW" when unset (line 2947), matching the agreed format, but still 10px font. Cardio boxes 60–90px; START REST and ↺ 44px; badges 11px; LVL 12px; L/R columns aligned. |
| 13 | Import keeps bodyweight | **Fixed** | Lines 97–98 and 115–121. |
| 14 | Grip / Arm length removed | **Partly** | UI fields gone, but `gripStrength`/`armLength` still feed the AI prompt (lines 196–209, 2828, 2872). Users who had "weak" saved are stuck with it and can't change it. Arc Trainer removed from the picker but still in the exercise list (line 763). |

## Prior open items still open

- **Mountain Climbers 3 min reads back as "3s".** `getLastLoggedDetail` checks `TIMED_EXERCISES` first (line 462). Root cause unchanged: one exercise, two types.
- **LAST "R—×—".** Missing side still filled with "—" (line 463), and the renderer treats "—" as data (line 1576).
- **HELP/ABOUT PF360 / Elevate Core wording** shows regardless of gym type (lines 3445–3446).
- **"2 MUSCLES" stat**: not touched by this commit.
- **API key in plain text** in `localStorage "ironlog:apikey"` (lines 218, 236).

## Other notes

- The timed seconds box still uses placeholder "sec" (lines 1243, 1254, 1311).

## Suggested next fixes, in order

1. Restore reps-only saves for bodyweight exercises (line 2478).
2. Give Mountain Climbers one type (remove it from `TIMED_EXERCISES` or `CARDIO_EXERCISES`) so ✓, input and LAST agree.
3. Stop "—" placeholders in the L/R LAST line.
4. Drop grip/arm from the prompt now that the UI is gone.
