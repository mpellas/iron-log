# 90Strong (iron-log) audit: commit 363c44b

Updated Oct 16, 2026, 1:00 PM PT. Commit 363c44b is empty; the real changes are in 5e1e199. This combines a desktop pass (Workouttester1), a phone pass at 390×844 with clean storage (Workouttester2) and a code review (Exercise app). The ✓ was tested on phone with a simulated AI plan, with no real AI calls.

## Open issues, in priority order

| # | Issue | Severity | Suggested fix |
|---|---|---|---|
| 1 | Plank: the AI target says "45 reps bodyweight", the wrong unit for a timed hold. ✓ does nothing. History saves "Plank · No data logged" as an empty exercise, and a confirmed Plank copy is dropped on save. | High | Show the target in seconds, let ✓ confirm or fill it, and never save an exercise with no data |
| 2 | Clearing bodyweight in Profile to 0 or blank keeps the old value behind the scenes (175 on phone, 180 on desktop) while the field shows blank. That old value is sent to the AI. | High | Treat a cleared field as "no bodyweight" and stop sending it |
| 3 | **New:** deloads are cancelled. The prompt tells the AI to drop one weight step after two missed sessions, but the code that reads the plan raises any lower weight back to your last peak (index.html, about lines 2504–2508). Typing the lower weight also triggers the "below last" warning. | High | Let a planned deload through, and skip the warning when the plan itself lowered the weight |
| 4 | **New:** the time budget contradicts itself. It asks for 3–4 superset pairs on short sessions, but the rules still say 5. The finisher is still a fixed 10 or 15 minutes, and the session-time estimate ignores the budget. | Medium | Use one pair count, scale the finisher, and base the estimate on the budget |
| 5 | Typing in a copied weight row and then clearing it saves a bogus "– × 10" set (weight field only; confirmed in a clean run) | Medium | Judge a set by its actual numbers, not the copied or touched markers |
| 6 | The save warning is misleading: "1 set has incomplete data (e.g. weight without reps) and will be dropped. Save the 1 complete set anyway?" | Low | Say the untouched copied rows will be dropped |
| 7 | A half-filled left/right set saves with only the generic confirm, and the LAST line shows "L50×10/R—×—" | Medium | Warn about the missing side, and fix how it's filled in (about line 433) |
| 8 | ✓ on a blank row with no target, and ADD SET on a blank row, give no message and don't move to the field | Low | Show a short message and focus the weight box |
| 9 | ✓ never fills cardio or timed rows (Jump Rope, Plank) from the target. That's by design in the code, but the agreed rule is to fill a blank row whenever there's a target. | Low | Fill these rows too (team recommendation) |
| 10 | Bike naming: the Cardio list says "Bike" and "Recumbent Bike", the equipment panel says "Stationary Bike". On phone, Hotel defaults to Treadmill. | Low | Use one name everywhere (keep Bike for Hotel) |
| 11 | The BW button just says "BW" instead of your weight. The Profile bodyweight field is 35px tall. Remaining small labels: BW 10px, LVL1 9px. | Low | Show the weight on the button, make the field 44px, raise labels to 12px |
| 12 | Grip strength and arm-length fields are still in Profile, and Arc Trainer is still in the commercial list | Low | Tidy up |
| 13 | Possible: the session timer carries across saves, giving stale "⏱ 1H 12M" tags in History. Seen once on desktop from a dirty start; not confirmed. | Unconfirmed | Recheck from a clean start |
| 14 | API key stored in plain text, in-browser Babel in production. Security is unchanged. | Backlog | Precompile; move the key out of plain storage |

## Agreed rules for the per-row ✓

- On a typed row, it saves exactly what's typed and never touches another row.
- On a copied row, it confirms the copied numbers.
- On a blank row with an AI target, it fills only that row with the target, and the numbers stay editable.
- On a blank row with no target, it refuses and highlights the field.

## Fixed since the last audit (ab1952a)

- The per-row ✓ follows the agreed rules for weight, left/right and bodyweight rows. On phone with a simulated plan (target 135×8): typing 140×6 in row 1 and tapping ✓ left rows 2 and 3 blank; ✓ on blank row 3 filled only that row with 135×8; editing it to 130 saved 130×8 in History.
- Exercises you add yourself now have the ✓.
- Switching to Hotel trims the cardio list right away, with no reload (14 to 9).
- Bodyweight is now in Profile and stays in sync with the BW button both ways.
- Most labels are now 12px, nav tabs are 60px tall, and the cards fit at 390px.
- 0 console errors.
- No regressions: Skip lands on LOG, no sideways scroll, and SAVE, History, REST DONE and SESSION RESTORED all work.

## Notes

The phantom Dumbbell Kickback seen during earlier testing came from something else using the shared test browser, not from the app. For future tests, close the app tab before clearing site data, or use a separate headless browser.
