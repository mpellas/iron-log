# 90Strong phone pass: 54e8ceb

Tester: Workouttester2. Date: Sun Oct 18, 2026, about 12:00 PM PT.

Setup: live GitHub Pages site, checked to be the same file as `index.html` at 54e8ceb before testing. A separate headless browser at 390x844 with touch and an iPhone user agent, no API key and no AI calls (AI REC and SCAN MACHINE not used). Run 1 starts from empty storage: the API-key prompt appeared and was skipped. Run 2 follows a saved workout. AI-plan cards come from a fake AI draft placed in storage before load, so the AI REC step itself is not exercised. The finisher rows in that draft were given the targets the new code would build from the AI's "duration" field.

This file is overwritten after every phone pass. The combined audit is in `audit/README.md`.

## Fixed in this version

- Cleared copied weight: clearing the weight on a copied Bench row no longer saves "– × 10". The save warning names it ("Dumbbell Bench Press set 4") and the row is dropped.
- Half-filled left/right set: an orange line appears under the set, "⚠ right side empty — will save single-side". It is 12px, but wraps onto a second line at this width.
- ✓ on a blank row with no target, and ADD SET on a blank row, now show a pop-up instead of doing nothing. Checked on Bench, Push-Ups, Plank, Jump Rope, Treadmill, Mountain Climbers and a Hammer Curl added to an AI plan.
- The save warning names each dropped exercise and set. A row that was typed and then fully cleared is dropped without a warning.
- Plank: 45 seconds saves as "45s" and reads back as "LAST: 45s · 45s". No "No data logged". A finisher Plank shows "AI TARGET: 40 seconds", and ✓ fills only that row.
- Jump Rope reads back as "LAST: 5min · 50cal" instead of "new exercise".
- Bike has the same name in the LOG list and the equipment list. "Stationary Bike" doesn't appear anywhere.
- Changing gym type updates the LOG cardio list and the equipment list without a reload. On Home, only Jump Rope is ticked, and the machines are marked "UNLIKELY".
- Grip strength and arm length are gone from Profile.
- Header BW button: it shows "BW", then "180 BW" once bodyweight is set. Tapping it opens the bodyweight prompt, and a blank or 0 entry clears it.
- Cardio boxes are wider (60–70px), so the "min", "lvl" and "cal" hints are no longer cut off. START REST is 44px tall. The L and R boxes line up.
- The session timer shows "EST / BUDGET 40:30 / 30M" in orange when the plan runs over a 30-minute budget.
- Earlier fixes still hold:
  - Typed rows save as typed, and ✓ never touches another row.
  - An AI fill goes into that row only, and the numbers stay editable (45 changed to 47.5 and saved).
  - Lighter AI weights: no hint at 45 (the AI weight), and the hint shows at 40.
  - Clearing Profile bodyweight works.
  - Card buttons don't cover exercise names.
  - SAVE is 350x52, and header buttons are 44px.
  - Nothing is wider than the screen on LOG, HISTORY, HELP, ABOUT or GAINS.

## New bugs

- **High (confirms desktop):** Push-Ups sets with only reps are not saved. 15 reps typed and confirmed on two sets (and 12/10 reps on an AI plan) were dropped. The warning contradicts itself: "Dropping 1 exercise with no data (Push-Ups) and 3 partial sets (... Push-Ups set 1, Push-Ups set 2)".
- **Medium:** A copied row that's never confirmed is dropped without any mention. Bench set 3 ("copied — type or tap ✓ to confirm", 50×10) was dropped, and the warning only listed set 4. It happened again in run 2 (Bench set 2).
- **Low:** On Jump Rope rows in an AI plan, ✓ on a blank row does nothing and shows no message. This covers both a superset row with a 60 target and a finisher row with a 45 target. Jump Rope also shows no AI TARGET line, so the finisher target the new code reads never appears.
- **Low:** The pop-up wording doesn't fit most rows. The ✓ pop-up says "Type weight × reps first" on Plank, Push-Ups, Jump Rope, Treadmill and Mountain Climbers, which have no weight box. On cardio, the ADD INTERVAL button's pop-up talks about "ADD SET". Neither pop-up highlights or focuses the empty box.
- **Low:** If you switch gym type to Home and then back to Commercial, only Jump Rope stays ticked. Treadmill, Bike, Elliptical and the other machines have to be re-ticked by hand.
- **Low:** A bodyweight of 182.5 shows as "183 BW" on the header button.
- **Low (phone sizes):**
  - Superset labels are 9px: "Superset 1", "A then B, no rest between", "🔥 FINISHER" and "spike your heart rate". "⟳ SESSION RESTORED" is also 9px.
  - LAST lines and "new exercise, no prior log" are 11px.
  - Profile boxes are 35–37px tall with 13px text, and CANCEL/RESET are 11px. The gym type box cuts off at "Full commercial gym (barbells, machines, ca".
  - These taps are under 44px:
    - REST 60s (94x33) and STOP (77x33)
    - "+ Add an exercise to this plan" (37px tall)
    - START SESSION TIMER (39px tall)
    - SCAN MACHINE (40px)
    - ADD and the exercise pickers (42px)
    - the YouTube link box (27px)
  - On AI cards, Remove wraps onto its own line under the other buttons.

## Still open

- Mountain Climbers: on an AI plan, ✓ puts the "30 seconds" target into the MIN box, and it saves as "30min". 3 minutes saves as "3min" but comes back as "LAST: 3s".
- The LAST line for a one-side set still shows "L30×10/R—×—".
- Treadmill and Bike rows: at 390 wide, both ✓ and ✕ drop to a second line. LEVEL is squeezed against the cal box. Level shows as "lv3.5" in LAST but "lv 3.5" in History.
- History stats don't count cardio. They show "3 MUSCLES" for a workout tagged CHEST / BACK / CORE / CARDIO.
- The header BW text is 10px.
- Cardio lists don't match. Arc Trainer is in the LOG cardio list but not in the equipment list. Ski Erg is in the equipment list but not in the LOG list.
- Hotel: after a switch from Home, Treadmill, Bike and Elliptical are unticked with no "UNLIKELY" label.
- The default Chest list on a fresh start begins with Smith Machine moves.
- ABOUT and HELP still mention grip strength and arm length. HELP still has the Planet Fitness section (PF360 rig, Elevate Core), and it's the same with gym type set to Home.
- When a lighter AI weight is typed under, the hint still says "below last: 45lb" even though 45 is the AI's weight.

## Not covered

- Real AI plans: anything that needs AI REC, including how the time budget changes the plan and how a real finisher's "duration" comes through.
- SCAN MACHINE.
- How the pop-ups look on a real iPhone. They are the browser's own pop-ups, which a headless browser can't capture, so only their wording was checked.
- Real iOS Safari. This pass used Chromium with an iPhone screen size and user agent.
- Backup import.

Screenshots are kept on the tester's machine in `ironlog-54e8ceb/` (files starting with `phone-`).
