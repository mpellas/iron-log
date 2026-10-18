# 90Strong (iron-log) audit: commit 54e8ceb

Updated Oct 18, 2026, 11:30 AM PT. Commit 54e8ceb is "Fix 14 items from the 9db6725 audit", pushed at 6:22 AM PT on Oct 18, 2026. This combines a desktop pass on Oct 18 at about 11:30 AM PT with site data cleared and no AI (Workouttester1), and a code review by Exercise app ([audit/code-review.md](code-review.md), commit a18040a), which found the live site matches the repo. The phone pass for this version ([audit/phone.md](phone.md), Workouttester2) is due at 11:55 AM PT and isn't included yet.

## Open issues, in priority order

| # | Issue | Severity | Suggested fix |
|---|---|---|---|
| 1 | **New:** Push-Ups and other bodyweight sets with only reps entered get dropped as "partial" on save. The fix for the "– × N" bug only keeps reps-only sets when an exercise has no weight box at all, and bodyweight rows have an empty one (about line 2478). The save warning names it: "Dropping 1 exercise with no data (Push-Ups) and 2 partial sets (... Push-Ups set 1)". | High | Treat reps-only sets as complete on bodyweight exercises, even when the weight box is there and empty |
| 2 | Mountain Climbers is listed as both a timed and a cardio exercise. ✓ puts its seconds target into the MIN box, and 3 minutes saves but reads back as "LAST: 3s". | High | Give each exercise one type, so it saves and reads back in the same unit |
| 3 | Saved grip and arm-length values are still sent to the AI, even though the fields are gone from Profile. ABOUT and HELP still tell users to fill in grip strength and arm length. | Medium | Stop sending those values (and clear any saved ones), and remove the ABOUT and HELP text |
| 4 | The LAST line still shows "L25×10/R—×—" for single-side sets | Low | Show only the side that was logged |
| 5 | History stats say "2 MUSCLES" for a workout tagged CHEST / CARDIO / CORE | Low | Count the same tags the entry shows, or leave cardio out consistently |
| 6 | Cardio lists don't match: Arc Trainer is in the cardio picker but not the equipment panel, and Ski Erg is in the panel but not the picker. Arc Trainer is still in the exercise list. | Low | Use one cardio list everywhere, and drop Arc Trainer if it's not wanted |
| 7 | HELP still mentions PF360 and Elevate Core, and the Planet Fitness text shows in ABOUT and HELP whatever the gym type | Low | Show the Planet Fitness text only when gym type is Planet Fitness |
| 8 | Treadmill row: the ✕ wraps onto its own line, the LEVEL label is cramped, and the grey hints are tiny. Level shows as "lv3.5" in LAST but "lv 3.5" in History. | Low | Keep the row on one line, enlarge the label and hints, and use one level format |
| 9 | The header BW button text is still 10px | Low | Raise it to 12px |
| 10 | Hotel: Treadmill, Bike and Elliptical are unticked with no "UNLIKELY" label. Minor; may be intended. | Low | Confirm the intent; label them "UNLIKELY" if they should stay visible |
| 11 | On a fresh start, the default chest picker includes Smith Machine moves | Low | Leave Smith Machine moves out of the defaults unless that equipment is ticked |
| 12 | API key stored in plain text. Not a concern until accounts or payments are added. | Backlog | Move the key out of plain storage when accounts arrive |

## Agreed rules for the per-row ✓

- On a typed row, it saves exactly what's typed and never touches another row.
- On a copied row, it confirms the copied numbers.
- On a blank row with an AI target, it fills only that row with the target, and the numbers stay editable.
- On a blank row with no target, it refuses and highlights the field.

## Fixed or passing in this build

Checked on desktop unless marked (code).

- A copied row with its weight cleared now gets a warning and is dropped. No more "– × N".
- A half-filled left/right set warns inline: "⚠ right side empty — will save single-side".
- ✓ and ADD SET on blank rows now explain with a pop-up. ✓ says "Type weight × reps first, then tap ✓ to confirm. (Or wait for an AI target to fill a blank row.)" ADD SET says "Fill in the current set before adding another. ADD SET copies the last filled row so you can tweak it."
- The save warning names each exercise and set it drops.
- Plank 45s saves and reads back as 45s.
- Jump Rope's LAST line now shows "LAST: 5min · 50cal" instead of "new exercise".
- Finisher items get targets (code).
- The time budget now sets the number of pairs and the finisher length (code).
- Bike has the same name everywhere. "Stationary Bike" is gone.
- Changing gym type updates the equipment without a reload. On Home, only Jump Rope is ticked.
- Importing a backup keeps the current bodyweight (code).
- The header BW button says "BW", then "180 BW" once bodyweight is set. It fits, and tapping it opens a bodyweight prompt.

## Notes

- Not tested on desktop: anything that needs the AI (no API key this pass).
- The phone pass for 54e8ceb will be in [audit/phone.md](phone.md) after 11:55 AM PT.
- Desktop screenshots are in /workspace/ironlog-54e8ceb/ on the test box.
