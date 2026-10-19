# 90Strong (iron-log) audit: commit 54e8ceb

Updated Oct 19, 2026, 2:50 PM PT. Commit 54e8ceb is "Fix 14 items from the 9db6725 audit", pushed at 6:22 AM PT on Oct 18, 2026. The app code hasn't changed since; later commits only touch this audit. This combines five sources:

- A desktop pass on Oct 18 at about 11:30 AM PT, with site data cleared and no AI (Workouttester1).
- A second desktop pass on Oct 18 at about 2:45 PM PT, with site data cleared, the live site matching the repo, and no AI (Workouttester1). It reconfirmed every open item below on desktop, tested fresh and again after saving one workout.
- A third desktop pass on Oct 19 at about 2:45 PM PT, with site data cleared, the live site matching the repo byte for byte, and no AI (Workouttester1). It found no new fixes and no regressions: every open item below reproduced again, and every item in the fixed list held. It was tested fresh and again after saving one workout.
- A phone pass on Oct 18 at about 12:00 PM PT, at 390×844 with touch, empty storage and no AI. A faked AI plan was used for the AI-plan cards (Workouttester2).
- A code review by Exercise app (commit a18040a), which found the live site matches the repo.

## Open issues, in priority order

| # | Issue | Severity | Suggested fix |
|---|---|---|---|
| 1 | **Confirmed on phone and desktop:** Push-Ups and other bodyweight sets with only reps entered get dropped as "partial" on save. The fix for the "– × N" bug only keeps reps-only sets when an exercise has no weight box at all, and bodyweight rows have an empty one (about line 2478). The save warning names it: "Dropping 1 exercise with no data (Push-Ups) and 2 partial sets (... Push-Ups set 1)". On phone, 15 reps on two sets (and 12/10 reps on an AI plan) were dropped the same way. The 2:45 PM desktop pass got the same warning for 15 reps with an empty weight box: "Dropping 1 exercise with no data (Push-Ups) and 1 partial set (Push-Ups set 1)". Push-Ups' LAST line then reads "new exercise, no prior log". On Oct 19 Push-Ups with 15 reps and an empty weight box was dropped again, and its LAST line still read "new exercise" after the save. | High | Treat reps-only sets as complete on bodyweight exercises, even when the weight box is there and empty |
| 2 | Mountain Climbers is listed as both a timed and a cardio exercise. ✓ puts its seconds target into the MIN box, and 3 minutes saves but reads back as "LAST: 3s". Confirmed on phone (AI-plan "30 seconds" saves as "30min"). | High | Give each exercise one type, so it saves and reads back in the same unit |
| 3 | **Confirmed on phone and desktop:** a copied row that's never confirmed is dropped at save with no mention. Bench set 3 (50×10, "copied — type or tap ✓ to confirm") was dropped while the warning only listed set 4. It happened again in run 2 (Bench set 2), and on desktop at 2:45 PM (Bench set 2 dropped, warning named only Push-Ups). The single-side warning shown inline isn't repeated in the save warning either. On Oct 19 the unconfirmed copied Bench set 2 was dropped again, and several unconfirmed copied rows can be stacked one after another before any is confirmed. | Medium | Either save the copied numbers or list the row in the save warning |
| 4 | Saved grip and arm-length values are still sent to the AI, even though the fields are gone from Profile. ABOUT and HELP still tell users to fill in grip strength and arm length (confirmed on phone). | Medium | Stop sending those values (and clear any saved ones), and remove the ABOUT and HELP text |
| 5 | The LAST line still shows "L25×10/R—×—" for single-side sets. Confirmed on phone ("L30×10/R—×—"). | Low | Show only the side that was logged |
| 6 | History stats don't count cardio. Desktop showed "2 MUSCLES" for a workout tagged CHEST / CARDIO / CORE. Phone showed "3 MUSCLES" for CHEST / BACK / CORE / CARDIO. Oct 19 desktop again showed "2 MUSCLES" for CHEST / CORE / CARDIO. | Low | Count the same tags the entry shows, or leave cardio out consistently |
| 7 | **New (phone, AI plan):** ✓ on a blank Jump Rope row does nothing and shows no message, on both a superset row (target 60) and a finisher row (target 45). Jump Rope shows no AI TARGET line, so the finisher target never appears. | Low | Show the AI TARGET line on Jump Rope and let ✓ fill it |
| 8 | **New (phone):** the pop-up wording doesn't fit most rows. The ✓ pop-up says "Type weight × reps first" on Plank, cardio and Push-Ups, which have no weight box. ADD INTERVAL's pop-up talks about "ADD SET". Neither pop-up highlights or focuses the empty box. | Low | Word each pop-up for the row's type, and focus the first empty box |
| 9 | Cardio lists don't match: Arc Trainer is in the cardio picker but not the equipment panel, and Ski Erg is in the panel but not the picker. Arc Trainer is still in the exercise list. Confirmed on phone. | Low | Use one cardio list everywhere, and drop Arc Trainer if it's not wanted |
| 10 | Switching gym type from Home back to Commercial leaves only Jump Rope ticked (phone and desktop). Treadmill, Bike, Elliptical and the other machines have to be ticked again by hand. | Low | Restore the gym type's default equipment when it's chosen |
| 11 | HELP still mentions PF360 and Elevate Core, and the Planet Fitness text shows in ABOUT and HELP whatever the gym type. Confirmed on phone (same with gym type set to Home). | Low | Show the Planet Fitness text only when gym type is Planet Fitness |
| 12 | Treadmill row: the ✕ wraps onto its own line, the LEVEL label is cramped, and the grey hints are tiny. Level shows as "lv3.5" in LAST but "lv 3.5" in History. Confirmed on phone, where both ✓ and ✕ drop to a second line on Treadmill and Bike. | Low | Keep the row on one line, enlarge the label and hints, and use one level format |
| 13 | The header BW button text is still 10px (confirmed on phone). A bodyweight of 182.5 shows as "183 BW" (phone and desktop). | Low | Raise the text to 12px and show the weight as entered |
| 14 | **New (phone sizes):** superset labels are 9px. REST 60s and STOP are 33px tall. Profile boxes are 35px tall, and the gym-type box text is cut off ("Full commercial gym (barbells, machines, ca"). | Low | Raise labels to 12px, make taps 44px tall, and let the gym-type box show its full text |
| 15 | Hotel: Treadmill, Bike and Elliptical are unticked with no "UNLIKELY" label. Confirmed on phone. Minor; may be intended. | Low | Confirm the intent; label them "UNLIKELY" if they should stay visible |
| 16 | On a fresh start, the default chest picker includes Smith Machine moves. On desktop at 2:45 PM, the Commercial chest list showed no barbell bench press at all, only Smith Machine Bench Press. | Low | Leave Smith Machine moves out of the defaults unless that equipment is ticked |
| 17 | API key stored in plain text. Not a concern until accounts or payments are added. | Backlog | Move the key out of plain storage when accounts arrive |

## Agreed rules for the per-row ✓

- On a typed row, it saves exactly what's typed and never touches another row.
- On a copied row, it confirms the copied numbers.
- On a blank row with an AI target, it fills only that row with the target, and the numbers stay editable.
- On a blank row with no target, it refuses and highlights the field.

## Fixed or passing in this build

Checked on desktop unless marked (phone) or (code).

- A copied row with its weight cleared now gets a warning and is dropped. No more "– × N".
- A half-filled left/right set warns inline: "⚠ right side empty — will save single-side".
- ✓ and ADD SET on blank rows now explain with a pop-up. ✓ says "Type weight × reps first, then tap ✓ to confirm. (Or wait for an AI target to fill a blank row.)" ADD SET says "Fill in the current set before adding another. ADD SET copies the last filled row so you can tweak it."
- The save warning names each exercise and set it drops.
- Plank 45s saves and reads back as 45s.
- A finisher Plank shows "AI TARGET: 40 seconds", and ✓ fills only that row (phone, faked AI plan).
- Jump Rope's LAST line now shows "LAST: 5min · 50cal" instead of "new exercise".
- Finisher items get targets (code).
- The time budget now sets the number of pairs and the finisher length (code). The session timer shows "EST / BUDGET 40:30 / 30M" when a plan runs over budget (phone).
- Bike has the same name everywhere. "Stationary Bike" is gone.
- Skip on the key prompt lands on LOG, both fresh and after a reload with history (desktop, 2:45 PM).
- No false "SESSION RESTORED" in a fresh session or after a reload (desktop, 2:45 PM). The console shows no errors or warnings.
- HISTORY expands to show sets, and the count reads "5 EXERCISES" (desktop, 2:45 PM).
- Changing gym type updates the equipment without a reload. On Home, only Jump Rope is ticked.
- Importing a backup keeps the current bodyweight (code).
- The header BW button says "BW", then "180 BW" once bodyweight is set. It fits, and tapping it opens a bodyweight prompt.
- Grip strength and arm length are gone from Profile (phone).
- Cardio boxes are wider (60–70px), so the "min", "lvl" and "cal" hints are no longer cut off (phone).
- START REST is 44px tall (phone).
- Nothing is wider than the screen at 390px on LOG, HISTORY, HELP, ABOUT or GAINS (phone).

## Notes

- Not tested: anything that needs real AI (AI REC, SCAN MACHINE), and backup import on a device.
- The phone pass used Chromium with an iPhone screen size, not real iOS Safari. Pop-ups were checked for wording only.
- The Oct 19 pass reached the app through the browser after clearing Chrome site data; its screenshots stayed in Workouttester1's own screenshot store.
- Desktop screenshots from the 11:30 AM pass are in /workspace/ironlog-54e8ceb/ on the test box. The 2:45 PM pass's screenshots stayed in Workouttester1's own screenshot store. Phone screenshots are on Workouttester2's machine (files starting with `phone-`).
