# 90Strong (iron-log) audit: commit d015a4d

Updated Oct 24, 2026. Commit d015a4d ("Clean up the Oct 24 a411361 audit: Medium regression + 8 Lows") was pushed at 10:30 AM PT on Oct 24, 2026, and tested around 12:55 PM PT. This audit also covers the two earlier commits that never got their own audit: 62e9f28 (installable app / PWA) and bf145f1 (privacy policy page and tip jar). It combines three sources:

- A desktop pass on Oct 24, with site data cleared and no AI (Workouttester1).
- A phone pass on Oct 24 at 390px wide with no AI (Workouttester2).
- A code review by Exercise app, which found the live site matches the repo. The tests pass 44 of 44.

New goal: release on Google Play and the Apple App Store with banner ads. See **Store readiness** below.

**Verdict: the app works well online, but it is NOT store-ready.** There's one High (offline cold start) and two Mediums, plus a list of store must-fixes.

## Open issues, in priority order

| # | Issue | Severity | Suggested fix |
|---|---|---|---|
| 1 | Offline cold start is broken. `sw.js` lines 53–57 save any page fetched online over `./index.html`, so after opening Privacy, an offline reload shows the Privacy Policy at the app's URL (desktop, reproduced twice). With a clean cache the page is blank (phone). The cache holds only the app's own 8 files, not React, ReactDOM or Babel (unpkg) or Google Fonts. | High | Cache index.html only for the app request with an ok response; cache or bundle the CDN scripts and fonts |
| 2 | The exercise ✕ (Remove) is now a bare ✕ with no confirm or undo. It looks identical to a set's ✕ (same red, 44x44) and sits about 88px above it. One tap deleted Dumbbell Bench Press and its 2 confirmed sets from the draft. | Medium | Add a confirm or undo, or use a different icon |
| 3 | The cardio row squeezes below 390px instead of wrapping. At 320px the boxes are 25px wide (12.5 shows "2.5", placeholders read "lv" and "ca"); at 280px they're 12px wide and unusable. | Medium | Let the row wrap, or set a minimum input width |
| 4 | The AI badge and HELP still say "tap SWAP" and ▲▼, but the button is now ⇄ | Low | Update the wording |
| 5 | The Privacy Policy link is about a 131x15px tap | Low | Make it 44px tall |
| 6 | Offline wording conflicts: the install panel says "Works offline", HELP says a cold reload needs internet | Low | Make them agree (after fixing #1) |
| 7 | The save pop-up still says "Dropping N exercises with no data…", and Cancel aborts the whole save | Low | Reword it, and let the save go ahead |
| 8 | Narrow tabs: on desktop the tabs truncate ("HIST…") at 256px (500% zoom) and in 393px emulation. On the phone, the nav fits at 256px but at 280px drops to 10px text with HISTORY cut off. | Low | Use shorter labels or icons at narrow widths |
| 9 | Profiles saved before gym type existed now default to Commercial instead of Planet Fitness | Low | Migrate old profiles to the previous default |
| 10 | Install steps are in ABOUT, not HELP | Low | Move or link them from HELP |
| 11 | The iOS home-screen meta tags appear twice in the page header | Low | Remove the duplicates |

## Store readiness (must-fix before submitting with ads)

- **Privacy text:** privacy.html, ABOUT and HELP say no ads, no analytics and no tracking. They need to cover AdMob and say that profile data (bodyweight, gym) goes to Anthropic. The policy also mentions sharing the key in backups, an option that doesn't exist.
- **Security policy:** the page's CSP blocks ad scripts.
- **Safe areas:** there are no safe-area insets for the notch or home bar.
- **Banner placement:** a bottom 320x50 banner fits with SAVE about 60px clear if the page gets bottom padding and pop-ups sit above the banner. Nothing is fixed to the bottom today. A top banner is a worse fit.
- **Store paperwork:** Google Play Data Safety and "contains ads", Apple privacy labels, the ATT prompt, EU consent, and an age rating of 13+ or 18+.
- **Tip jar:** it shows "coming soon". It must be hidden in store builds or use in-app purchase (Apple 3.1.1, Play billing).
- **Google Play:** needs a verification file at the domain root, so a custom domain.
- **iOS:** needs a native Capacitor build (Apple 4.2 rejects plain web wrappers).
- **AI consent:** a consent screen before any data goes to Anthropic (Apple 5.1.2(i)).
- **Build:** bundle React and pre-build the code instead of compiling with Babel in the browser.
- **External links:** decide whether the YouTube, Anthropic and GitHub links open in the app or in the browser.
- **API key:** it's stored in plain text.

## Fixed in this build

- Treadmill and Bike ✓ and ✕ stay on one line at 390px.
- A one-side L/R set saves, with an info banner afterward.
- "+ Add an exercise" and START SESSION TIMER are 44px.
- The AI card buttons fit on one 44px row.
- LAST shows "lb" and matches History.
- A copied row with both fields cleared gets an alert.
- ABOUT shows the Planet Fitness gear text only on Planet Fitness.
- No tap target under 44px and no text under 12px at 390px, except the Privacy link.
- PWA: installs as 90Strong in a standalone window; the manifest and icons are OK.

## Earlier fixes still passing

- Push-Ups with only reps entered saves as "BW × 15".
- Mountain Climbers reads back as 3min and 45s.
- The partial-set warning works.
- A bodyweight of 182.5 shows as "182.5 BW".
- On Planet Fitness, Chest defaults to Smith Machine Bench Press.

## Notes

- Not covered: real AI plans, SCAN MACHINE, backup import, a real iPhone or installed iOS app, a real ad SDK, and OK/Cancel on the copied-set prompt.
