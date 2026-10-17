# 90Strong (iron-log) audit: commit 9db6725

Updated Oct 17, 2026, 1:00 PM PT. Commit 9db6725 is "Fix 3 HIGH audit items from 363c44b audit". This combines a code review (Exercise app) and a phone pass at 390×844 with fresh storage and a faked AI plan, with no API key and no real AI calls (Workouttester2). The desktop pass (Workouttester1) is due at 2:53 PM PT and isn't included yet.

## Open issues, in priority order

| # | Issue | Severity | Suggested fix |
|---|---|---|---|
| 1 | **New:** ✓ on cardio-type rows puts the target into the MIN box. Mountain Climbers shows "30 seconds", but ✓ fills 30 MIN and History saves "30min". Other cardio rows copy the AI's rep count into minutes (Burpees "15" becomes 15 min), with no target line shown first. | High | Fill the box that matches the target's unit (seconds, reps or minutes), and show the target line before ✓ uses it |
| 2 | Finisher Plank and Jump Rope get no target, so ✓ does nothing on them. The AI sends finisher items as a `duration`, but the app only reads `reps`. | Medium | Read `duration` for finisher items and show it as the target |
| 3 | Typing in a copied weight row and then clearing it still saves "– × N" and counts it as a complete set | Medium | Judge a set by its actual numbers, not the copied or touched markers |
| 4 | A half-filled left/right set gets no warning, the empty side is dropped, and the LAST line shows "L30×10/R—×—" | Medium | Warn about the missing side, and don't save an empty side |
| 5 | ✓ and ADD SET on a blank row with no target give no message (this includes the finisher Jump Rope) | Low | Show a short message and focus the weight box |
| 6 | The save warning doesn't say which set is dropped, and it counts a fully cleared row as "partial" | Low | Name the exercise and set, and treat a cleared row as empty |
| 7 | **New:** during a deload, the hint says "below last: 45lb" when 45 is the AI's target | Low | Skip the hint when the weight matches the AI target |
| 8 | The time budget contradicts itself. It asks for 3–4 superset pairs on short sessions, but the rules still say 5. The finisher is fixed at 10 or 15 minutes, and the session-time estimate ignores the budget. | Medium | Use one pair count, scale the finisher, and base the estimate on the budget |
| 9 | **New:** Jump Rope's LAST line still says "new exercise" after it's been logged | Low | Read the last log for cardio and timed exercises too |
| 10 | **New:** changing gym type leaves commercial cardio checked until a reload (seen on phone; the earlier desktop pass saw the list trim right away) | Low | Trim the cardio list as soon as gym type changes |
| 11 | Bike naming: the Cardio list says "Bike", the equipment panel says "Stationary Bike" | Low | Use one name everywhere |
| 12 | Sizes: the BW button just says "BW" instead of your weight. Treadmill's min/lvl/cal boxes are 33px wide, so their hints are cut off. Several labels are 8–11px (superset headers, L+R tags, LVL). START REST is 96×23. The L and R boxes don't line up. | Low | Show the weight on the button, widen the boxes, raise labels to 12px, make START REST 44px tall, and align the L/R boxes |
| 13 | **New:** importing an old backup with no bodyweight wipes the stored bodyweight | Low | Keep the current bodyweight when the backup has none |
| 14 | Grip strength and arm-length fields are still in Profile, and Arc Trainer is still in the commercial list | Low | Tidy up |
| 15 | API key stored in plain text. Not a concern until accounts or payments are added. | Backlog | Move the key out of plain storage when accounts arrive |

## Agreed rules for the per-row ✓

- On a typed row, it saves exactly what's typed and never touches another row.
- On a copied row, it confirms the copied numbers.
- On a blank row with an AI target, it fills only that row with the target, and the numbers stay editable.
- On a blank row with no target, it refuses and highlights the field.

## Fixed since the last audit (363c44b)

- Plank: the target now reads "AI TARGET: 45 seconds". ✓ fills only that row, History saves "45s", and "No data logged" is gone.
- Clearing Profile bodyweight to 0 or blank now removes the stored value, so an old value can't reach the AI. The header BW prompt works the same way. The "180" on a clean start is only the field's placeholder, not a stored value.
- Deloads now get through. The code that raised lower weights back to your last peak is gone, so a lower AI weight stays, and the orange hint only fires below the AI target.
- The save warning now names the exercises it drops, for example "Dropping 2 exercises with no data (Lateral Raises, Jump Rope)".
- Earlier fixes still pass: typed rows save as typed, ✓ never fills the next row, ADD SET copies, the Home and Hotel filters work, stats use singular wording, header buttons are 44px, SAVE is 52px, and nothing overflows at 390px.

## Notes

- MARK DONE is gone in this build.
- Not tested yet: a deload when a real plan loads (needs AI REC).
- Phone screenshots are in /workspace/ironlog-9db6725/ on the test box.
