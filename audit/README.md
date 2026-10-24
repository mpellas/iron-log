# 90Strong (iron-log) audit: commit 7d10855

Updated Oct 24, 2026. Commit 7d10855 was pushed at 2:16 PM PT on Oct 20, 2026. This combines three sources:

- A desktop pass on Oct 24, with site data cleared, no AI and 0 console errors (Workouttester1).
- A phone pass on Oct 24 at 390px wide with no AI (Workouttester2).
- A code review by Exercise app, which found the live site matches the repo. The tests now run against the app's real code and pass 34 of 34.

**Verdict: shippable.** Nothing High or Medium was confirmed. Everything still open is Low or polish.

## Open issues, in priority order

| # | Issue | Severity | Suggested fix |
|---|---|---|---|
| 1 | A half-filled left/right set (right side empty) shows the inline "⚠ right side empty" hint while you type (phone), but saving gives no warning (desktop) | Low | Mention single-side sets in the save warning too |
| 2 | ABOUT and HELP still have Planet Fitness, PF360 and Elevate Core text on desktop. The phone pass saw PF360 gone, but HELP's GAINS line still mentions Elevate Core for every gym type. | Low | Show Planet Fitness text only when gym type is Planet Fitness |
| 3 | Mountain Climbers saved from a "45 sec" target reads back as "LAST: 0.75min" (phone) | Low | Show times under a minute in seconds |
| 4 | Typing below an AI weight shows "↓ below last: 45lb" when LAST was 50. It's comparing against the AI's weight but calls it "last" (phone). | Low | Compare against LAST, or label it as the AI target |
| 5 | An unfilled Jump Rope row in an AI plan saves empty weight and reps fields along with its time. Nothing visible breaks (phone). | Low | Leave out the empty fields on cardio rows |
| 6 | Muscle tags and the MUSCLES count leave cardio out | Low | Confirm this is intended |
| 7 | On Treadmill and Bike rows the ✕ wraps onto its own line (phone only, not desktop) | Low | Keep the row on one line |
| 8 | Some labels are 9–11px | Low | Raise labels to 12px |
| 9 | Several taps are under 44px: Add an exercise (37px), SCAN MACHINE (40), ADD and the pickers (42), and the YouTube box (27) | Low | Make taps 44px tall |
| 10 | Remove wraps on AI cards | Low | Keep it on one line |
| 11 | At about 256px wide, the header ⚙ goes off-screen and AI REC wraps | Low | Let the header shrink or wrap cleanly |
| 12 | API key stored in plain text. Not a concern until accounts or payments are added. | Backlog | Move the key out of plain storage when accounts arrive |

## Fixed or passing in this build

- Push-Ups with only reps entered saves and shows "BW × 15" in History, including Push-Ups from an AI plan.
- Mountain Climbers is cardio only, and 3 min reads back as 3min.
- Cardio ✓ turns "45 sec" into 0.75 min.
- A target with no unit gets a clear pop-up.
- A copied row that's never confirmed now gets a save-as-is or drop prompt. This was seen on phone. The desktop run probably auto-dismissed the pop-up, which the code treats as Cancel.
- A copied row with its numbers cleared warns as partial.
- The LAST line for a one-side set reads "L30×8", with no R—×—.
- Each pop-up's wording fits its row type.
- Switching gym type from Home back to Commercial re-ticks the machines (phone).
- A bodyweight of 182.5 shows as "182.5 BW" at 12px.
- Treadmill level reads lv3.5 in both LAST and History.
- Arc Trainer is gone and Ski Erg has been added.
- Planet Fitness hides barbell lifts, Sumo Deadlift, barbell RDL, Skull Crushers and Close-Grip Bench, and Chest defaults to Smith Machine Bench Press.
- Commercial Chest has Barbell Bench.
- Grip strength and arm length are gone.
- Superset headers are 12px.

## Notes

- Not covered: real AI REC plans, SCAN MACHINE, backup import, and real iOS Safari.
