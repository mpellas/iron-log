#!/usr/bin/env node
// Run with: node tests/regression.js
//
// Extracts module-scope helpers DIRECTLY from index.html and runs assertions against them, so a
// future edit that breaks a production function also fails the test (not just a drift-prone copy).
// This replaces the earlier "copy the function body into the test" approach which the 934380e code
// review correctly called out as unable to catch real bugs.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const scriptMatch = html.match(/<script type="text\/babel">\n([\s\S]*?)\n<\/script>/);
if (!scriptMatch) { console.error("Could not find <script type='text/babel'> in index.html"); process.exit(1); }
const scriptSrc = scriptMatch[1];

// We only need the module-scope declarations: the Set constants and the pure helper functions
// defined just below them (hasAnyData, parseCardioAiTarget). React components reference `React` and
// `useState` and would blow up in a plain Node sandbox, so we extract a prefix slice ending right
// before the first component definition.
const firstComponentIdx = scriptSrc.search(/\nfunction [A-Z][A-Za-z0-9_]*\s*\(/);
if (firstComponentIdx < 0) { console.error("Could not find first React component in script"); process.exit(1); }
const prefix = scriptSrc.slice(0, firstComponentIdx);

// Make the Set constants available by declaring an empty window + a localStorage shim first,
// then evaluating the prefix. We skip the `const {useState,...} = React;` line at the top.
// Globals the production prefix depends on. React is stubbed with the three hooks
// the top-of-file destructures. localStorage is an in-memory shim.
const prelude = `
  var React = {
    createElement: () => null,
    useState: () => [null, () => {}],
    useEffect: () => {},
    useRef: () => ({ current: null }),
  };
  var window = { location: { hash: "" }, history: { replaceState: () => {} }, AudioContext: null, prompt: () => "" };
  var localStorage = {
    _store: {},
    getItem(k) { return this._store[k] ?? null; },
    setItem(k, v) { this._store[k] = String(v); },
    removeItem(k) { delete this._store[k]; },
  };
  var navigator = { vibrate: () => {} };
  var document = { getElementById: () => null };
`;

// `const` declarations at the top of a VM script don't become context properties; wrap the whole
// thing in an IIFE that returns the exports we need to test. This is cheaper than parsing out each
// function individually and keeps us in lockstep with the production source.
const exportsList = [
  "hasAnyData", "parseCardioAiTarget",
  "BODYWEIGHT_EXERCISES", "TIMED_EXERCISES", "CARDIO_EXERCISES", "RUNG_EXERCISES",
  "LEVEL_EXERCISES", "ASSISTED_EXERCISES", "UNILATERAL_EXERCISES",
  "buildGymExclusionSet", "EXERCISE_LIBRARY", "GYM_ONLY_EXPLICIT", "PF_SPECIFIC_EXERCISES",
];
const wrapped = `
  (() => {
${prelude}
${prefix}
    return { ${exportsList.join(", ")} };
  })()
`;
let exported;
try {
  exported = vm.runInNewContext(wrapped, { console });
} catch (e) {
  console.error("Failed to evaluate index.html prefix:", e.message);
  console.error("Hint: a new module-scope declaration may reference a browser-only API, or an\n  exported symbol may have been renamed.");
  process.exit(1);
}
const { hasAnyData, parseCardioAiTarget, BODYWEIGHT_EXERCISES, buildGymExclusionSet, EXERCISE_LIBRARY } = exported;
const ctx = exported;
if (typeof hasAnyData !== "function") { console.error("hasAnyData missing from module scope"); process.exit(1); }
if (typeof parseCardioAiTarget !== "function") { console.error("parseCardioAiTarget missing from module scope"); process.exit(1); }
if (!BODYWEIGHT_EXERCISES || !BODYWEIGHT_EXERCISES.has("Push-Ups")) { console.error("BODYWEIGHT_EXERCISES not loaded (Push-Ups missing)"); process.exit(1); }
if (typeof buildGymExclusionSet !== "function") { console.error("buildGymExclusionSet missing from module scope"); process.exit(1); }
if (!EXERCISE_LIBRARY) { console.error("EXERCISE_LIBRARY not loaded"); process.exit(1); }

// ---------- Assertions ----------
let pass = 0, fail = 0;
const t = (name, ok) => {
  if (ok) { pass++; console.log("PASS:", name); }
  else { fail++; console.log("FAIL:", name); }
};

// Guard 1 & 2: hasAnyData shape discrimination (now bodyweight-NAME-aware)
t("hasAnyData: weighted set with cleared weight DROPPED", hasAnyData({ weight: "", reps: "8" }, "Bench Press") === false);
t("hasAnyData: Push-Ups (no weight key) with reps KEPT", hasAnyData({ reps: "15" }, "Push-Ups") === true);
t("hasAnyData: Push-Ups with stale weight=\"\" key STILL KEPT (name-aware fix)", hasAnyData({ weight: "", reps: "15" }, "Push-Ups") === true);
t("hasAnyData: weighted with both KEPT", hasAnyData({ weight: "100", reps: "8" }, "Bench Press") === true);
t("hasAnyData: pending copy DROPPED", hasAnyData({ weight: "100", reps: "8", _pending: true }, "Bench Press") === false);
t("hasAnyData: unilateral partial L KEPT", hasAnyData({ weightL: "50", repsL: "8", weightR: "", repsR: "" }, "Single-Arm Dumbbell Row") === true);
t("hasAnyData: cardio duration KEPT", hasAnyData({ duration: "15" }, "Treadmill") === true);
t("hasAnyData: fully blank DROPPED", hasAnyData({ weight: "", reps: "" }, "Bench Press") === false);

// Guard 3: parseCardioAiTarget unit-aware
t("cardio: '15 reps' → refuse (reps-flavored)", parseCardioAiTarget("15 reps").fill === false);
t("cardio: '60 sec' → fill 1 min", parseCardioAiTarget("60 sec").fill === true && parseCardioAiTarget("60 sec").minutes === 1);
t("cardio: '45 sec' → fill 0.75 min (2-decimal precision)", parseCardioAiTarget("45 sec").minutes === 0.75);
t("cardio: '5 min' → fill 5 min", parseCardioAiTarget("5 min").fill === true && parseCardioAiTarget("5 min").minutes === 5);
t("cardio: bare '15' → refuse (ambiguous)", parseCardioAiTarget("15").fill === false);
t("cardio: empty string → refuse", parseCardioAiTarget("").fill === false);
t("cardio: '30 seconds' → fill 0.5 min", parseCardioAiTarget("30 seconds").minutes === 0.5);
t("cardio: refusal reason is informative", typeof parseCardioAiTarget("15").refusalReason === "string");

// Guard: PF exclusion includes barbells (Audit 934380e #2)
const pfExcl = buildGymExclusionSet("planet-fitness", EXERCISE_LIBRARY);
t("PF excludes Barbell Bench Press", pfExcl.has("Barbell Bench Press"));
t("PF excludes Barbell Row", pfExcl.has("Barbell Row"));
t("PF excludes Barbell Deadlift", pfExcl.has("Barbell Deadlift"));
t("PF excludes Barbell Overhead Press", pfExcl.has("Barbell Overhead Press"));
t("PF excludes Sumo Deadlift", pfExcl.has("Sumo Deadlift"));
t("PF still includes Smith Machine Bench Press", !pfExcl.has("Smith Machine Bench Press"));
t("PF still includes Dumbbell Bench Press", !pfExcl.has("Dumbbell Bench Press"));
t("PF excludes PF360 for other users (sanity)", buildGymExclusionSet("commercial", EXERCISE_LIBRARY).has("PF360 Pushup + Climber"));
t("Commercial does NOT exclude Barbell Bench Press", !buildGymExclusionSet("commercial", EXERCISE_LIBRARY).has("Barbell Bench Press"));

// Guard: home still excludes Smith Machine
const homeExcl = buildGymExclusionSet("home", EXERCISE_LIBRARY);
t("Home excludes Smith Machine Bench Press", homeExcl.has("Smith Machine Bench Press"));
t("Home excludes Barbell Bench Press", homeExcl.has("Barbell Bench Press"));
t("Home excludes Lat Pulldown", homeExcl.has("Lat Pulldown"));

// Guard 4: Uni LAST line undefined → side skipped. (This is a render-shape invariant; tested
// by reasoning rather than exec'd here, since it lives inside a React component.)
const renderUniLast = (sets) => sets.map(s => {
  const hasL = s.L !== undefined && s.L !== "" && s.L !== null;
  const hasR = s.R !== undefined && s.R !== "" && s.R !== null;
  const segs = [];
  if (hasL) segs.push(`L${s.L}×${s.rL}`);
  if (hasR) segs.push(`R${s.R}×${s.rR}`);
  return segs.join("/") || "—";
}).join("  ·  ");
t("uni LAST: L-only (undefined R) → L25×10", renderUniLast([{ L: "25", R: undefined, rL: "10", rR: undefined }]) === "L25×10");
t("uni LAST: both filled → L25×10/R20×8", renderUniLast([{ L: "25", R: "20", rL: "10", rR: "8" }]) === "L25×10/R20×8");

// Guard: Mountain Climbers only in CARDIO
t("Mountain Climbers NOT in BODYWEIGHT_EXERCISES", !ctx.BODYWEIGHT_EXERCISES.has("Mountain Climbers"));
t("Mountain Climbers NOT in TIMED_EXERCISES", !ctx.TIMED_EXERCISES.has("Mountain Climbers"));
t("Mountain Climbers IS in CARDIO_EXERCISES", ctx.CARDIO_EXERCISES.has("Mountain Climbers"));

// Guard: Chest list leads with Barbell for commercial users
t("Chest list leads with Barbell Bench Press", EXERCISE_LIBRARY.Chest[0] === "Barbell Bench Press");

console.log("---");
console.log(`${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
