// ---------------------------------------------------------------------------
// Prima Veritas OSS — canonical_transform.mjs
// Deterministic field-level canonicalization (dataset-agnostic)
// Part of the Prima Veritas OSS reproducibility toolkit.
// MIT License.
// ---------------------------------------------------------------------------
//
// Canonical transforms must remain:
//   – Pure functions (no side effects)
//   – Free of randomness and system state
//   – Free of timestamps or environment-dependent behavior
//   – Stable across Node versions (string ops + numeric coercions only)
//
// Purpose:
//   Convert raw record objects into a canonical, normalized representation
//   with deterministic key ordering and type cleanup. This is the first step
//   in ensuring cross-machine reproducibility for ingest → normalize → analyze
//   pipelines.
//
// Notes for contributors:
//   • Keep this file minimal and auditable.
//   • Do not add dataset-specific logic here.
//   • Any transform affecting numerical precision must be explicitly justified.
// ---

export function canonicalTransform(row) {
  const out = {};

  // Deterministic key ordering:
  const keys = Object.keys(row).sort();

  for (const key of keys) {
    let value = row[key];

    // Trim whitespace deterministically
    if (typeof value === "string") {
      value = value.trim();
    }

    // Convert obvious numeric strings → numbers
    if (typeof value === "string" && /^[+-]?\d+(\.\d+)?$/.test(value)) {
      value = Number(value);
    }

    // Convert null-ish to null
    if (value === "" || value === undefined || value === NaN) {
      value = null;
    }

    out[key] = value;
  }

  return out;
}
