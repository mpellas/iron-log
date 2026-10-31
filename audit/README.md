# 90Strong audit: 5d5f0f8 (Oct 31, 2026)

This audit covers commits 10d0f7b, 3623786 and 5d5f0f8. It combines a desktop pass, a 390px phone pass and a code review, with no AI used.

**Verdict:** the app works well online and offline, with no High app bugs. It is **not yet store-ready**.

## Fixed since the d015a4d audit
- **Offline start (was High):** the `sw.js` overwrite is fixed, and an offline start now loads the full app on desktop and phone.
- **Exercise remove (was Medium):** it is now a 🗑 button (44×46) that asks to confirm. There is no undo.
- **Cardio row (was Medium):** it fits and wraps cleanly at 390, 320 and 280px.
- "tap SWAP" now reads "⇄".
- The Privacy link is now 165×44 on desktop and a 162×44 pill on phone.
- The offline wording is now consistent between the install panel and HELP.
- All 7 tabs fit at 280px.
- The AI card buttons are all at least 44px.
- 45s reads back as LAST 45s.
- **Build:** Babel was replaced by an esbuild bundle, which also removed the duplicate iOS tags.
  - Rebuilding from `src/app.jsx` reproduces the live files byte for byte.
  - `regression.js` passes 44/44, and `smoke.js` passes after `npm ci`.

## Medium
1. **Offline right after install:** the page loads `app.js?v=…`, but the service worker only caches `./app.js`. If the phone goes offline right after the first visit, the app opens blank. This comes from the code review and wasn't reproduced on a device.
2. **Regression, save:** the save confirm was removed, so partial sets and empty exercises are dropped with no way to cancel. All the user gets is a 6-second note afterwards.
3. **Regression, gym type:** profiles without a gym type default to Planet Fitness (`src/app.jsx` line 156), but imported backups default to Commercial (line 114).

## Low
- On the consent screen, ACCEPT is 43px tall, CANCEL is 41px, and its Privacy link is only 73×15.
- ACCEPT fires the AI request right away.
- Tab text drops to 9px at 300px wide or less.
- The Google fonts aren't cached for offline use.
- The header and tabs scroll away mid-log.
- PF Legs still shows Romanian Deadlifts.
- Deleting has no undo.
- The install steps are in ABOUT, not HELP.
- The policy says "no cookies", but Chrome listed 5 cookies for the site.
- The links on the privacy page are 19px tall.
- **Verified working:** REVOKE AI CONSENT appears in HELP after you accept (187×44). It confirms first, and revoking works.

## Store readiness
**Done:**
- An AI consent gate appears before any call to Anthropic, and CANCEL sends nothing.
- The privacy policy was rewritten to cover the data sent to Anthropic and the planned AdMob ads.
- There's 90–110px of bottom space, so a 320×50 banner fits.
- React is bundled.

**Still needed:**
- Native builds (Capacitor).
- AdMob integration.
- The iOS tracking (ATT) prompt.
- The EU ad-consent form (UMP).
- The security policy (CSP) still blocks ad scripts.
- iPhone safe-area padding.
- Hide the tip jar ("coming soon") and the "no ads" text in ABOUT and HELP in store builds.
- A custom domain for Play.
- Store paperwork: Play Data Safety, Apple privacy labels and an age rating.
- The plaintext API key.

**Wording:**
- The consent screen and the policy say Anthropic stores nothing beyond the request. By default, Anthropic's API keeps data for a period (around 30 days; not verified).
- The policy mentions an ad-choice control that doesn't exist.

## Not covered
- The ⇄ wording in the AI badge.
- Real AI output.
- Real iOS Safari.
- Going offline after a single first visit on a device.

Desktop screenshots are in `/workspace/ironlog-5d5f0f8/desktop/` on my computer.
