// ---------------------------------------------------------------------------
// Prima Veritas OSS — deterministic_normalize.mjs (v0.1.0)
// Dataset-agnostic canonical normalization engine.
// MIT License.
// ---------------------------------------------------------------------------
//
// Purpose:
//   Convert arbitrary CSV text into a deterministic JSON array using strict,
//   reproducible rules. The output forms the foundation for deterministic
//   analytics (e.g., KMeans) and must be stable across all machines.
//
// Determinism Guarantees:
//   • Lexicographic field ordering
//   • canonicalTransform() → stable typing + stable key order
//   • Output row order = original CSV row order (minus blanks)
//   • No randomness, timestamps, locale drift, or platform dependence
//   • Canonical JSON serialization via writeDeterministicJSON()
//
// Contributor Rules:
//   • No async I/O, dynamic heuristics, autocasting, or environment state.
//   • All transforms must remain deterministic, stateless, transparent.
//   • Any additions must preserve bit-for-bit reproducibility.
// ---------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import { canonicalTransform } from "../transforms/canonical_transform.mjs";

// ------------------------------------------------------------
// Deterministic CSV → canonical JSON normalization
// ------------------------------------------------------------
export function deterministicNormalize(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== "");
  if (lines.length === 0) return [];

  // Canonical header ordering (sorted lexicographically)
  const rawHeader = lines[0].split(",").map(h => h.trim());
  const header = [...rawHeader].sort();

  const normalized = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");

    if (parts.length === 0) continue;

    // Build row object using raw header order
    const rowObj = {};
    for (let j = 0; j < rawHeader.length; j++) {
      const key = rawHeader[j];
      const val = parts[j] !== undefined ? parts[j].trim() : "";
      rowObj[key] = val;
    }

    // Apply deterministic transform (typing + key normalization)
    const transformed = canonicalTransform(rowObj);

    // Canonicalize ordering using sorted header
    const ordered = {};
    for (const key of header) {
      ordered[key] = transformed[key] ?? null;
    }

    normalized.push(ordered);
  }

  return normalized;
}

// ------------------------------------------------------------
// Deterministic JSON writer
// ------------------------------------------------------------
export function writeDeterministicJSON(outPath, data) {
  const json = JSON.stringify(data, null, 2);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, json, "utf8");
}
