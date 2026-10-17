# 90Strong (iron-log) audit: commit 9db6725

Updated Oct 17, 2026, 2:50 PM PT. Commit 9db6725 is "Fix 3 HIGH audit items from 363c44b audit" (later commits only touch the audit folder; live Pages matches the repo). This combines a code review (Exercise app), a phone pass at 390×844 with fresh storage and a faked AI plan (Workouttester2), and a desktop pass at 1024px with site data cleared, no API key, and no AI REC or SCAN MACHINE (Workouttester1). The desktop pass tested a fresh state first, then again after saving one workout.

## Open issues, in priority order

| # | Issue | Severity | Suggested fix |
|---|---|---|---|
| 1 | ✓ on cardio-type rows puts the target into the MIN box. Mountain Climbers shows "30 seconds", but ✓ fills 30 MIN and History saves "30min". Other cardio rows copy the AI's rep count into minutes (Burpees "15" becomes 15 min), with no target line shown first. (Phone, AI plan.) | High | Fill the box that matches the target's unit (seconds, reps or minutes), and show the target line before ✓ uses it |
| 2 | **New (desktop, after one save):** Mountain Climbers logged as 3 MIN (History "3min") comes back on the next log as "LAST: 3s". The minutes value is read back as seconds. | High | Store and read cardio/timed values with their unit, and format LAST from that unit |
| 3 | Finisher Plank and Jump Rope get no target, so ✓ does nothing on them. The AI sends finisher items as a `duration`, but the app only reads `reps`. | Medium | Read `duration` for finisher items and show it as the target |
| 4 | Typing in a copied weight row and then clearing it still saves "– × N" and counts it as a complete set. Reconfirmed on desktop: Bench saved "50lb × 8" and "– × 8". | Medium | Judge a set by its actual numbers, not the copied or touched markers |
| 5 | A half-filled left/right set gets no warning, the empty side is dropped, and the LAST line shows "L25×10/R—×—". Reconfirmed on desktop (History "L:25lb×10"). | Medium | Warn about the missing side, and don't save an empty side |
| 6 | **Desktop:** SAVE WORKOUT shows no warning at all when no whole exercise is dropped, even with a cleared copied row and a half L/R set in the session. The new warning only covers fully empty exercises. | Medium | Include partial and one-sided sets in the save check |
| 7 | The time budget contradicts itself. It asks for 3–4 superset pairs on short sessions, but the rules still say 5. The finisher is fixed at 10 or 15 minutes, and the session-time estimate ignores the budget. | Medium | Use one pair count, scale the finisher, and base the estimate on the budget |
| 8 | Changing gym type leaves commercial cardio checked until a reload. **Now seen on desktop too:** after switching to Home and saving, the cardio picker still had Treadmill, Stationary Bike, Recumbent Bike, Elliptical and Stair Climber ticked (marked "UNLIKELY"), while the LOG Cardio list already hides Treadmill. | Low | Trim the cardio picker as soon as gym type changes, so it matches the LOG list |
| 9 | ✓ and ADD SET on a blank row with no target give no message (finisher Jump Rope, and on desktop blank Plank and Mountain Climbers rows with no plan) | Low | Show a short message and focus the first box |
| 10 | The save warning doesn't say which set is dropped, and it counts a fully cleared row as "partial" | Low | Name the exercise and set, and treat a cleared row as empty |
| 11 | During a deload, the hint says "below last: 45lb" when 45 is the AI's target | Low | Skip the hint when the weight matches the AI target |
| 12 | Jump Rope's LAST line still says "new exercise" after it's been logged (phone) | Low | Read the last log for cardio and timed exercises too |
| 13 | **New (desktop):** History stats show "2 MUSCLES" for a session tagged CHEST / CARDIO / CORE | Low | Count the same tags the entry shows, or leave cardio out consistently |
| 14 | The header BW button only ever says "BW", even with bodyweight set to 180, and on desktop clicking it did nothing visible | Low | Show the weight on the button and make the click open the bodyweight prompt |
| 15 | Sizes: on phone, Treadmill's min/lvl/cal boxes are 33px wide and their hints are cut off (about 63px and readable at desktop width). Several labels are 8–11px (superset headers, L+R tags, LVL), and header icon labels are tiny on desktop even though the buttons are 44px. START REST is 96×23. The L and R boxes don't line up. | Low | Widen the boxes on phone, raise labels to 12px, make START REST 44px tall, and align the L/R boxes |
| 16 | Bike naming: the Cardio list says "Bike", the equipment panel says "Stationary Bike" | Low | Use one name everywhere |
| 17 | Importing an old backup with no bodyweight wipes the stored bodyweight | Low | Keep the current bodyweight when the backup has none |
| 18 | Grip strength and arm-length fields are still in Profile. HELP still says "The three items below are Planet Fitness-specific… PF360 rig…" and mentions grip and arm length; ABOUT mentions the PF360 rig and Elevate Core plus grip and arm length. None of it changes with gym type. Arc Trainer is still in the commercial list. | Low | Tidy up, or show the PF text only when gym type is Planet Fitness |
| 19 | **New (desktop):** after changing category, the exercise dropdown is sometimes empty for a moment | Low | Fill the list in the same step as the category change |
| 20 | API key stored in plain text. Not a concern until accounts or payments are added. | Backlog | Move the key out of plain storage when accounts arrive |

## Agreed rules for the per-row ✓

- On a typed row, it saves exactly what's typed and never touches another row.
- On a copied row, it confirms the copied numbers.
- On a blank row with an AI target, it fills only that row with the target, and the numbers stay editable.
- On a blank row with no target, it refuses and highlights the field.

## Fixed or passing in this build

- Plank: the target now reads "AI TARGET: 45 seconds". ✓ fills only that row, History saves "45s", LAST reads "45s", and "No data logged" is gone.
- Clearing Profile bodyweight to 0 or blank now removes the stored value, so an old value can't reach the AI. The "180" on a clean start is only the field's placeholder.
- Deloads now get through. A lower AI weight stays, and the orange hint only fires below the AI target.
- The save warning names the exercises it drops, for example "Dropping 2 exercises with no data (Lateral Raises, Jump Rope)".
- Desktop, fresh state: SKIP — USE WITHOUT AI lands on LOG (not ABOUT). Blank SET 1 + ADD SET adds no extra rows. ADD SET copies set 1. The session timer is manual (START SESSION TIMER). Typed Plank seconds, cardio minutes and Treadmill min/level stay where typed and ✓ moves nothing.
- Desktop, after one save: HISTORY expands and collapses, the stats use "1 WORKOUT", and a reload with an unsaved draft shows a genuine SESSION RESTORED with all exercises back (no false banner, no stale data). Console shows 0 errors and 0 warnings.
- Earlier fixes still pass: typed rows save as typed, ✓ never fills the next row, the Home and Hotel LOG filters work, header buttons are 44px, SAVE is 52px, and nothing overflows at 390px.

## Notes

- MARK DONE is gone in this build.
- Not tested yet: a deload when a real plan loads (needs AI REC), and a reload with no session in progress on desktop.
- Phone screenshots are in /workspace/ironlog-9db6725/ on the test box. Desktop screenshots weren't saved to disk this run.
