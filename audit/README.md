# 90Strong (iron-log) audit: commit a411361

Updated Oct 24, 2026. Commit a411361 ("Clean up 11 Low items") was pushed at 5:29 AM PT on Oct 24, 2026, and tested around 6:10 AM PT. This combines three sources:

- A desktop pass on Oct 24, with site data cleared, no AI, save pop-ups clicked by hand and 0 console errors (Workouttester1).
- A phone pass on Oct 24 at 390px wide with no AI (Workouttester2).
- A code review by Exercise app, which found the live site matches the repo. The tests pass 44 of 44.

**Verdict: shippable.** There's one Medium layout regression on phone. Everything else still open is Low or polish.

## Open issues, in priority order

| # | Issue | Severity | Suggested fix |
|---|---|---|---|
| 1 | On Treadmill and Bike rows at 390px, both ✓ and ✕ now drop to a second line under the inputs. This is a regression: before, only ✕ wrapped. This commit put both buttons in one group that can't split (lines 1383–1397). It's fine on desktop, even at 500% zoom. | Medium | Stop the row from wrapping and let the inputs shrink |
| 2 | Saving a one-side L/R set brings up a blocking pop-up: "Dropping 1 single-side set…", even though the set is kept. Cancel stops the whole save. | Low (should-fix) | Reword it, and make it a note that doesn't block the save |
| 3 | "+ Add an exercise to this plan" is 37px tall (line 3284), and START SESSION TIMER is 39px | Low (should-fix) | Make taps 44px tall |
| 4 | Remove still wraps under SWAP on AI cards at 390px. The line 1712 change doesn't fix it at that width. | Low | Keep it on one line |
| 5 | ABOUT still describes Planet Fitness gear for every gym type (line 3628) | Low | Show it only for Planet Fitness |
| 6 | The code still has three 8px labels. The phone saw nothing 11px or smaller on the screens it checked. | Low | Raise them to 12px |
| 7 | At 256px the nav tabs shrink to 37px, and every tab except LOG is cut off with "…". The ⚙ now stays on screen. | Low | Use shorter labels or icons at narrow widths |
| 8 | **New:** A copied row with both fields cleared is dropped with no message | Low | Warn, or say it was dropped |
| 9 | **New:** LAST leaves out "lb" (30×8), while History shows "30lb × 8" | Low | Use the same format in both |
| 10 | API key stored in plain text. Not a concern until accounts or payments are added. | Backlog | Move the key out of plain storage when accounts arrive |

## Intentional

- Muscle tags and the MUSCLES count leave cardio out on purpose.

## Fixed in this build

- A half-filled L/R set shows the inline hint, and saving now warns too.
- Cardio under a minute reads "45s".
- The hint now says "below AI target".
- Cardio rows no longer save empty weight and reps fields.
- Elevate Core and PF360 text is gone from HELP for gym types other than Planet Fitness.
- SCAN MACHINE, the pickers, the YouTube box and ADD are 44px or taller.
- Remove is 44px tall.

## Earlier fixes still passing

- Push-Ups with only reps entered saves as "BW × 15".
- Mountain Climbers reads back as 3min.
- The copied-row prompt works with OK and Cancel clicked by hand: OK saves the copies and Cancel drops them.
- The partial-set warning works.
- On Planet Fitness, Chest defaults to Smith Machine Bench Press and barbell lifts are hidden.
- A bodyweight of 182.5 shows as "182.5 BW".
- Treadmill level reads lv3.5 in both LAST and History.
- Ski Erg is in the cardio list.

## Notes

- Not covered: real AI plans, SCAN MACHINE, backup import, and real iOS Safari.
