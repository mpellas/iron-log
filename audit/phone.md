# 90Strong phone pass: 9db6725

Tester: Workouttester2. Date: Sat Oct 17, 2026, about 12:00 PM PT.

Setup: live GitHub Pages site, a separate headless browser at 390x844 with touch and an iPhone user agent, no API key and no AI calls. Run 1 starts from empty storage; run 2 follows a saved workout. AI-plan cards come from a fake AI draft placed in storage before load, so the AI REC step itself is not exercised.

This file is overwritten after every phone pass. The combined audit is in `audit/README.md`.

## Fixed in this version

- Plank: the target reads in seconds, ✓ fills only that row, and history no longer says "No data logged".
- Save warning now names exercises that get dropped entirely.
- Bodyweight: clearing it to 0 or blank in Profile removes the old value.
- Lighter planned weights: a lower AI weight stays, and the orange "below last" hint shows only when typing below that weight (tested on a fake AI plan).
- Earlier fixes still hold.

## New bug (High)

- On cardio-type rows, ✓ puts the seconds target into the MIN box. Mountain Climbers shows "30 seconds" but saves "30min". A Jump Rope row also saved "60min" (the 60 was a test-seeded value).

## Still open

- A copied weight that is cleared still saves as "– × 10" and counts as a complete set.
- A left/right set with one side filled saves with no warning; the LAST line shows "R—×—".
- ✓ or ADD SET on a blank row with no target does nothing and gives no message.
- The save warning doesn't say which individual set is dropped.
- The picker says "Bike"; the equipment list says "Stationary Bike".
- Several labels and buttons are still small; the header BW button doesn't show the weight.

## Not covered

- How a real AI plan handles lighter weights when it loads (needs the AI feature, which this pass doesn't use).

Screenshots are kept on the tester's machine in `ironlog-9db6725/`.
