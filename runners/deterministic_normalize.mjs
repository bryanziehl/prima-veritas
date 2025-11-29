// ---------------------------------------------------------------------------
// Prima Veritas OSS — deterministic_normalize.mjs
// Dataset-agnostic canonical normalization engine.
// MIT License.
// ---------------------------------------------------------------------------
//
// Purpose:
//   Convert arbitrary CSV text into a deterministic JSON array using
//   strict, reproducible rules. This serves as the foundation for
//   downstream analytics (e.g., deterministic KMeans) and ensures that
//   researchers, auditors, and automated systems can reproduce identical
//   normalization output on any machine.
//
// Determinism Guarantees:
//   • Field names are parsed then sorted lexicographically.
//   • canonicalTransform() enforces stable typing + key ordering.
//   • Output row order = original row order (minus blank lines).
//   • No randomness, timestamps, locale drift, or machine-specific ops.
//   • JSON stringification is fully stable (indentation + ordering).
//
// Notes for Contributors:
//   Maintain purity. No async I/O, no environment-dependent behavior,
//   no auto-detection heuristics, and no transformations that depend
//   on external state. All changes must preserve bit-for-bit
//   reproducibility when fed identical inputs.
//
//   If additional transforms are added in the future, they must remain:
//     - deterministic,
//     - stateless,
//     - transparent,
//     - reversible or well-documented.
//
// --------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import { canonicalTransform } from "../transforms/canonical_transform.mjs";

/**
 * Deterministic normalization rules:
 *  - Sort fields lexicographically
 *  - Apply canonicalTransform() to each row
 *  - Output JSON array with stable ordering
 *  - No timestamps, randomness, or nondeterministic ops
 */

export function deterministicNormalize(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== "");
  if (lines.length === 0) return [];

  // Deterministic header parsing
  const header = lines[0]
    .split(",")
    .map(h => h.trim())
    .sort();                       // <— canonical field order

  const normalized = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");

    if (parts.length === 0) continue;

    // Build row (unordered object)
    const rowObj = {};
    const rawKeys = lines[0].split(",").map(h => h.trim());

    for (let j = 0; j < rawKeys.length; j++) {
      rowObj[rawKeys[j]] = parts[j] !== undefined ? parts[j].trim() : "";
    }

    // Canonical transform enforces ordering + types
    const transformed = canonicalTransform(rowObj);

    // Reorder deterministically by sorted header
    const ordered = {};
    for (const key of header) {
      ordered[key] = transformed[key] ?? null;
    }

    normalized.push(ordered);
  }

  return normalized;
}

/**
 * Deterministic JSON writer for normalized data.
 * Ensures stable ordering & no whitespace drift.
 */
export function writeDeterministicJSON(outPath, data) {
  const json = JSON.stringify(data, null, 2);

  fs.writeFileSync(outPath, json, "utf8");
}
