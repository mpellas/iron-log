# Building 90Strong

Phase-2 pre-compile pipeline. Source lives in `src/`; the top-level `index.html` and `app.js`
are **build outputs** — don't edit them by hand.

## Prerequisites

```
node >= 18
npm  >= 10
```

## Install

```
npm install
```

## Build

```
npm run build
```

This runs `build.js`, which:
1. Bundles `src/app.jsx` with esbuild (React 18, JSX transform, minify) into `app.js`.
2. Renders `src/index.template.html` into `index.html`, substituting a cache-busting build hash.
3. Updates `sw.js`'s `CACHE_VERSION` to match the build hash so service-worker caches purge in
   lockstep with the new bundle.
4. Fails the build if the compiled `index.html` still references `@babel/standalone`, unpkg,
   `<script type="text/babel">`, or `'unsafe-eval'` in CSP (regression guards from past audits).

## Test

```
npm test
```

Runs two test suites back to back:
- `tests/regression.js` — 44+ assertions against the module-scope helpers in `src/app.jsx`
  (hasAnyData shape/name discrimination, parseCardioAiTarget unit awareness, PF barbell
  exclusion, Mountain Climbers routing, bodyweight clear path, etc.). These exercise the
  SAME functions that ship, by evaluating the source in a vm sandbox with React stubs.
- `tests/smoke.js` — loads the built `index.html` + `app.js` in a jsdom browser and asserts
  the React tree renders with zero console errors. Catches "I shipped a broken import" or
  "bundle throws at top level" the moment they happen.

## Verify

```
npm run verify
```

Builds + runs both test suites. Run this before every push.

## Deploy

GitHub Pages serves whatever is in the repo root. After `npm run verify`, commit the generated
`index.html`, `app.js`, and `sw.js` along with any source changes under `src/`. Push to `main`.
The site auto-updates in ~1 minute.

## Files

```
src/
  app.jsx                 # the entire application (components + helpers)
  index.template.html     # HTML shell; __BUILD_HASH__ is substituted at build time
build.js                  # bundle + render + regression-guard checks
sw.js                     # service worker (CACHE_VERSION is bumped by build.js)
privacy.html              # standalone privacy policy page (not built)
manifest.json             # PWA manifest
icon-*.png                # PWA icons

index.html                # BUILD OUTPUT — do not edit
app.js                    # BUILD OUTPUT — do not edit
```

## Regression discipline

Past audits caught the same bug classes multiple times. The regression harness locks in the
fixes so a future ship can't silently reintroduce them. If an audit flags something new, add
an assertion to `tests/regression.js` before closing the ticket.
