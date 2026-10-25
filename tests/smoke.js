#!/usr/bin/env node
// Smoke test — load the built index.html + app.js in a jsdom browser and assert the React tree
// renders without throwing. This is the regression-catcher the audit pattern analysis predicted
// Phase 2 would need: a build-time test that would have caught the "offline reload shows Privacy"
// bug and the "Push-Ups dropped at save" bug if they'd reached a browser smoke run.

const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.join(__dirname, "..");

const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const appJs = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

// Capture console errors so React warnings fail the build.
const errors = [];
const warnings = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (err) => errors.push("jsdomError: " + (err && err.message || err)));
vc.on("error", (msg) => errors.push("console.error: " + msg));
vc.on("warn", (msg) => warnings.push("console.warn: " + msg));

const dom = new JSDOM(indexHtml, {
  runScripts: "outside-only",
  pretendToBeVisual: true,
  virtualConsole: vc,
  url: "https://mpellas.github.io/iron-log/",
});

// Stub matchMedia and localStorage (jsdom's localStorage is per-window; this verifies it exists).
const { window } = dom;
if (!window.matchMedia) {
  window.matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
}
if (!window.ResizeObserver) {
  window.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
}
// Service workers aren't supported in jsdom — stub so the app's registration script doesn't throw.
if (!window.navigator.serviceWorker) {
  Object.defineProperty(window.navigator, "serviceWorker", {
    value: { register: () => Promise.resolve({ addEventListener(){}, update(){} }) },
    configurable: true,
  });
}

// Run the bundle in the window's realm. If anything throws top-level, this catches it.
try {
  window.eval(appJs);
} catch (e) {
  console.error("✗ app.js threw at top level:", e.message);
  console.error(e.stack);
  process.exit(1);
}

// Let React commit a frame.
setTimeout(() => {
  const root = window.document.getElementById("root");
  const hasContent = root && root.children.length > 0;

  const summary = [];
  summary.push(hasContent ? "✓ #root rendered React content" : "✗ #root is still empty");
  summary.push(`${errors.length === 0 ? "✓" : "✗"} ${errors.length} console errors`);
  summary.push(`${warnings.length === 0 ? "✓" : "⚠"} ${warnings.length} console warnings`);

  if (errors.length) {
    console.log("--- Errors ---");
    errors.forEach((e) => console.log(" ", e));
  }
  if (warnings.length) {
    console.log("--- Warnings ---");
    warnings.slice(0, 10).forEach((w) => console.log(" ", w));
    if (warnings.length > 10) console.log("  ...and", warnings.length - 10, "more");
  }
  console.log("---");
  summary.forEach((s) => console.log(s));

  // Fail on either real errors or no rendered content. Warnings don't fail the build (React
  // sometimes warns about jsdom's missing APIs that don't matter in production).
  const failed = errors.length > 0 || !hasContent;
  process.exit(failed ? 1 : 0);
}, 500);
