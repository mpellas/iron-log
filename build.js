#!/usr/bin/env node
// 90Strong build — Phase 2 pre-compile.
//
// Takes src/app.jsx + src/index.template.html and produces the deploy-ready pair:
//   index.html  — references the bundled JS at ./app.js (no in-browser Babel, no CDN scripts)
//   app.js      — React + ReactDOM + application code, bundled by esbuild, minified
//
// Also validates:
//   - the bundle is smaller than a sanity cap (sudden size growth = unexpected import)
//   - index.html has no leftover <script type="text/babel"> or unpkg references
//   - CSP no longer needs 'unsafe-eval' (we drop that line post-build)
//
// Design notes (so a future ship doesn't drift):
//   - index.template.html is the SOURCE of truth for all meta/CSP/manifest/links. The compiled
//     index.html is derived; don't edit it directly.
//   - The service worker (sw.js) is NOT bundled — it's served as-is at the root.
//   - privacy.html is also served as-is (no app code).
//   - CACHE_VERSION in sw.js and the ?v=HASH query string on <script src="app.js"> both carry
//     the same build hash so a new deploy busts the service worker cache in lockstep.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const esbuild = require("esbuild");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");

async function build() {
  // 1. Bundle app.jsx → app.js
  const result = await esbuild.build({
    entryPoints: [path.join(SRC, "app.jsx")],
    bundle: true,
    minify: true,
    format: "iife",
    target: ["es2020"],
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    sourcemap: false,
    legalComments: "none",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    outfile: path.join(ROOT, "app.js"),
    logLevel: "info",
  });

  if (result.errors.length) {
    console.error("Build failed with", result.errors.length, "errors");
    process.exit(1);
  }

  const bundleBytes = fs.statSync(path.join(ROOT, "app.js")).size;
  console.log(`✓ app.js: ${(bundleBytes / 1024).toFixed(1)} KB`);
  // Sanity cap: React 18 + the app's current code is ~210 KB minified. If this suddenly jumps
  // above 350 KB, something unexpected was imported.
  if (bundleBytes > 350 * 1024) {
    console.error(`✗ app.js exceeded 350 KB sanity cap (${bundleBytes} bytes). Investigate.`);
    process.exit(1);
  }

  // Hash the bundle so index.html can carry a cache-busting ?v=HASH on the script tag.
  const bundleHash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(ROOT, "app.js")))
    .digest("hex")
    .slice(0, 10);

  // 2. Render index.template.html → index.html
  let tpl = fs.readFileSync(path.join(SRC, "index.template.html"), "utf8");
  tpl = tpl.replace(/__BUILD_HASH__/g, bundleHash);
  // Belt-and-suspenders: forbid stragglers from the Babel era in the compiled output.
  const forbidden = [
    { re: /<script type="text\/babel">/, msg: "leftover <script type='text/babel'>" },
    { re: /unpkg\.com/, msg: "unpkg CDN reference" },
    { re: /@babel\/standalone/, msg: "@babel/standalone reference" },
    // Only flag unsafe-eval if it appears inside the actual CSP meta tag's content.
    { re: /Content-Security-Policy[^"]*"[^"]*'unsafe-eval'/, msg: "'unsafe-eval' in CSP (should be removed post-build)" },
  ];
  for (const f of forbidden) {
    if (f.re.test(tpl)) {
      console.error(`✗ Template still contains ${f.msg}. Fix src/index.template.html.`);
      process.exit(1);
    }
  }
  fs.writeFileSync(path.join(ROOT, "index.html"), tpl);
  console.log(`✓ index.html rendered (hash=${bundleHash})`);

  // 3. Keep sw.js's CACHE_VERSION in sync with the build hash.
  let sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  const next = `const CACHE_VERSION = "build-${bundleHash}";`;
  const re = /^const CACHE_VERSION = "[^"]+";/m;
  if (!re.test(sw)) {
    console.error("✗ sw.js has no CACHE_VERSION line matching the build pattern.");
    process.exit(1);
  }
  sw = sw.replace(re, next);
  // Ensure the APP_SHELL cache list includes app.js.
  if (!/APP_SHELL\s*=\s*\[[^\]]*app\.js/s.test(sw)) {
    console.error("✗ sw.js APP_SHELL does not include ./app.js — update sw.js by hand.");
    process.exit(1);
  }
  fs.writeFileSync(path.join(ROOT, "sw.js"), sw);
  console.log(`✓ sw.js CACHE_VERSION bumped to build-${bundleHash}`);

  console.log("Build complete.");
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
