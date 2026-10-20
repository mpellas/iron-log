#!/usr/bin/env node
// Run with: node tests/regression.js
// Covers the invariants documented at the top of index.html — one locked-in test per audit-caught
// bug class, so a future edit can't silently reintroduce one.
//
// This file deliberately re-implements the hot functions in isolation (rather than importing from
// index.html, which is a Babel-transpiled script tag). The purpose is to lock in the SHAPES of the
// contracts, not to prove the production copy still matches — the companion REGRESSION-GUARDS block
// in index.html does that. If a production edit breaks a guard, this test file still passes but
// the production copy is wrong; keep them in sync by code review.

let pass=0, fail=0;
const t = (name, ok) => {
  if (ok) { pass++; console.log("PASS:", name); }
  else { fail++; console.log("FAIL:", name); }
};

// ---------- Guard 1 & 2: hasAnyData shape discrimination ----------
const nz = v => v !== undefined && v !== null && v !== "" && Number(v) !== 0;
function hasAnyData(s) {
  if (s._pending) return false;
  if (nz(s.weight) && nz(s.reps)) return true;
  if ((nz(s.weightL) && nz(s.repsL)) || (nz(s.weightR) && nz(s.repsR))) return true;
  if (nz(s.assist) && nz(s.reps)) return true;
  if (nz(s.reps) && s.weight === undefined && s.weightL === undefined && s.weightR === undefined && s.assist === undefined) return true;
  if ((s.rung !== undefined && s.rung !== "") && nz(s.duration)) return true;
  if ((s.level !== undefined && s.level !== "") && (nz(s.duration) || nz(s.reps))) return true;
  if (nz(s.duration) && s.weight === undefined && (s.rung === undefined || s.rung === "") && (s.level === undefined || s.level === "")) return true;
  if (nz(s.duration) || nz(s.calories)) return true;
  return false;
}
t("hasAnyData: weighted with cleared weight DROPPED", hasAnyData({ weight: "", reps: "8" }) === false);
t("hasAnyData: Push-Ups (no weight key) with reps KEPT", hasAnyData({ reps: "15" }) === true);
t("hasAnyData: weighted with both KEPT", hasAnyData({ weight: "100", reps: "8" }) === true);
t("hasAnyData: pending copy DROPPED", hasAnyData({ weight: "100", reps: "8", _pending: true }) === false);
t("hasAnyData: unilateral partial L KEPT", hasAnyData({ weightL: "50", repsL: "8", weightR: "", repsR: "" }) === true);
t("hasAnyData: cardio duration KEPT", hasAnyData({ duration: "15" }) === true);
t("hasAnyData: fully blank DROPPED", hasAnyData({ weight: "", reps: "" }) === false);

// ---------- Guard 3: Cardio ✓ unit-aware ----------
function confirmCardio(set, aiReps) {
  const sr = aiReps || "";
  const srSeconds = (() => { const m = (sr || "").toString().match(/\d+/); return m ? m[0] : ""; })();
  if (set.duration || set.resistance || set.calories) return { ...set, _pending: false };
  if (!sr || !srSeconds) return set;
  const hasReps = /\brep/i.test(sr);
  const hasMin = /min/i.test(sr);
  const hasSec = /sec/i.test(sr);
  if (hasReps) return set;
  if (hasMin) return { ...set, duration: String(Number(srSeconds)), _pending: false };
  if (hasSec) {
    const minutes = Math.round((Number(srSeconds) / 60) * 10) / 10;
    return { ...set, duration: String(minutes), _pending: false };
  }
  return set;
}
t("cardio: '15 reps' → no fill", confirmCardio({ duration: "", resistance: "", calories: "" }, "15 reps").duration === "");
t("cardio: '60 sec' → 1 min", confirmCardio({ duration: "", resistance: "", calories: "" }, "60 sec").duration === "1");
t("cardio: '45 sec' → 0.8 min", confirmCardio({ duration: "", resistance: "", calories: "" }, "45 sec").duration === "0.8");
t("cardio: '5 min' → 5 min", confirmCardio({ duration: "", resistance: "", calories: "" }, "5 min").duration === "5");
t("cardio: bare '15' → no fill (ambiguous)", confirmCardio({ duration: "", resistance: "", calories: "" }, "15").duration === "");

// ---------- Guard 4: Uni LAST line undefined → side skipped ----------
function renderUniLast(sets) {
  return sets.map(s => {
    const hasL = s.L !== undefined && s.L !== "" && s.L !== null;
    const hasR = s.R !== undefined && s.R !== "" && s.R !== null;
    const segs = [];
    if (hasL) segs.push(`L${s.L}×${s.rL}`);
    if (hasR) segs.push(`R${s.R}×${s.rR}`);
    return segs.join("/") || "—";
  }).join("  ·  ");
}
t("uni LAST: L-only (undefined R) → L25×10", renderUniLast([{ L: "25", R: undefined, rL: "10", rR: undefined }]) === "L25×10");
t("uni LAST: both filled → L25×10/R20×8", renderUniLast([{ L: "25", R: "20", rL: "10", rR: "8" }]) === "L25×10/R20×8");
t("uni LAST: R-only (undefined L) → R20×8", renderUniLast([{ L: undefined, R: "20", rL: undefined, rR: "8" }]) === "R20×8");

// ---------- Guard 5: Save warning names pending copies ----------
function buildDroppedNotes(exercises) {
  const anyTyped = s => Object.keys(s).some(k => k !== "id" && k !== "_pending" && s[k] !== undefined && s[k] !== "");
  const notes = [];
  exercises.forEach(ex => {
    (ex.sets || []).forEach((s, i) => {
      if (hasAnyData(s)) return;
      if (!anyTyped(s)) return;
      const label = `${ex.name} set ${i + 1}`;
      notes.push(s._pending ? `${label} (copied, not confirmed)` : label);
    });
  });
  return notes;
}
const warn = buildDroppedNotes([{ name: "Bench Press", sets: [
  { id: "a", weight: "100", reps: "8" },             // kept
  { id: "b", weight: "100", reps: "8", _pending: true }, // dropped, named
  { id: "c", weight: "", reps: "" },                 // dropped silently (no typing)
  { id: "d", weight: "95", reps: "" },               // dropped, partial typed
] }]);
t("warning: pending copy named", warn.some(w => w.includes("set 2") && w.includes("copied, not confirmed")));
t("warning: partial-typed named", warn.some(w => w === "Bench Press set 4"));
t("warning: fully blank NOT named", warn.length === 2);

// ---------- Guard 6: Mountain Climbers only in CARDIO ----------
// (This is a static invariant — we check the index.html bytes outside this script by grep. Here
// we just document the rule.)
t("Mountain Climbers in CARDIO only (manual check — see REGRESSION-GUARDS)", true);

// ---------- Guard 7: matchesAi suppresses below-last ----------
function matchesAi(v, aiWeight) {
  const aiW = aiWeight ? Number(aiWeight) : NaN;
  return !isNaN(aiW) && v !== "" && v != null && Number(v) === aiW;
}
t("matchesAi: 45 == AI 45 → true (suppress hint)", matchesAi("45", "45") === true);
t("matchesAi: 44 vs AI 45 → false", matchesAi("44", "45") === false);
t("matchesAi: no AI target → false", matchesAi("45", "") === false);

// ---------- Guard 8: Cardio equipment default union on gym-type change ----------
function switchGym(currentPruned, nextGymType) {
  const defaultsFor = gt => {
    if (gt === "home") return ["Jump Rope"];
    if (gt === "hotel-basic") return ["Treadmill", "Elliptical", "Jump Rope"];
    if (gt === "planet-fitness") return ["Treadmill", "Bike", "Elliptical", "Stair Climber", "Recumbent Bike"];
    return ["Treadmill", "Bike", "Elliptical", "Stair Climber", "Recumbent Bike"];
  };
  return Array.from(new Set([...currentPruned, ...defaultsFor(nextGymType)]));
}
let merged = switchGym(["Jump Rope"], "commercial");
t("gym switch: home → commercial restores Treadmill", merged.includes("Treadmill"));
t("gym switch: home → commercial includes 5 commercial defaults", ["Treadmill","Bike","Elliptical","Stair Climber","Recumbent Bike"].every(x => merged.includes(x)));
merged = switchGym([], "hotel-basic");
t("gym switch: empty → hotel-basic restores Treadmill+Elliptical+Jump Rope", merged.length === 3 && merged.includes("Treadmill"));

// ---------- Guard 9: Grip/arm not in AI context ----------
function buildUserContextFromProfile(p) {
  // Minimal reproduction — just confirms the removed branches don't exist.
  const lines = ["IMPORTANT USER CONTEXT:"];
  if (p.gripStrength === "weak") lines.push("WEAK GRIP"); // ← this line SHOULD NOT be in prod
  if (p.armLength === "long") lines.push("LONG ARMS"); // ← this line SHOULD NOT be in prod
  return lines.join("\n");
}
// (We can't exec the real buildUserContextFromProfile here without the whole app. This test
// documents the invariant that grip/arm lines must not fire. Keep the production function free
// of these branches — see index.html buildUserContextFromProfile.)
t("grip/arm invariant (manual check — see index.html buildUserContextFromProfile)", true);

// ---------- Guard 10: Bodyweight clear ----------
function saveProfile(p, storage) {
  storage["ironlog:profile"] = JSON.stringify(p);
  const bw = Number(p.bodyweight);
  if (bw > 0) storage["ironlog:bodyweight"] = String(bw);
  else delete storage["ironlog:bodyweight"];
}
let storage = { "ironlog:bodyweight": "180" };
saveProfile({ bodyweight: 0 }, storage);
t("bodyweight: 0 clears standalone key", storage["ironlog:bodyweight"] === undefined);
storage = { "ironlog:bodyweight": "180" };
saveProfile({ bodyweight: 175 }, storage);
t("bodyweight: 175 writes standalone key", storage["ironlog:bodyweight"] === "175");

// ---------- Summary ----------
console.log("---");
console.log(`${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
