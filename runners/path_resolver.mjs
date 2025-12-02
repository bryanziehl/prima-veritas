// ---------------------------------------------------------------------------
// Prima Veritas OSS — path_resolver.mjs  (v0.1.0)
// Canonical hybrid-path resolver for Docker + local execution.
// MIT License.
// ---------------------------------------------------------------------------
//
// Purpose:
//   Provide a single deterministic source of truth for locating dataset
//   inputs/outputs regardless of execution environment.
//
//   Every runner (fullproof, kmeans, normalization, future analytics)
//   should use this to resolve:
//
//       • raw CSV path
//       • normalized JSON path
//       • analytics output path
//
// Determinism Guarantees:
//   • Path resolution uses fixed rules; no environment guessing.
//   • Docker takes priority if its absolute paths exist.
//   • Local paths fall back to <repo>/datasets/<dataset>/.
//   • No randomness, no timestamps, no OS-specific logic beyond existence check.
//
// Notes For Contributors:
//   • NEVER inject dynamic behavior or auto-search logic.
//   • This file must remain minimal, predictable, and stable forever.
//   • Any dataset "<name>" must follow the canonical:
//         datasets/<name>/<name>_raw.csv
//         datasets/<name>/<name>_normalized.json
//         datasets/<name>/<name>_kmeans.json
// ---------------------------------------------------------------------------

import fs from "fs";
import path from "path";

/**
 * Resolve dataset paths in deterministic order:
 *   1. If Docker paths exist → use Docker
 *   2. Otherwise → use local repo-relative paths
 *
 * Returns:
 *   {
 *     raw:        <absolute path>,
 *     normalized: <absolute path>,
 *     kmeans:     <absolute path>,
 *     env:        "docker" | "local"
 *   }
 */
export function resolveDatasetPaths(dataset) {
  const dockerRaw        = `/app/datasets/${dataset}/${dataset}_raw.csv`;
  const dockerNorm       = `/app/datasets/${dataset}/${dataset}_normalized.json`;
  const dockerKMeans     = `/app/datasets/${dataset}/${dataset}_kmeans.json`;

  const localRaw         = path.join(process.cwd(), "datasets", dataset, `${dataset}_raw.csv`);
  const localNorm        = path.join(process.cwd(), "datasets", dataset, `${dataset}_normalized.json`);
  const localKMeans      = path.join(process.cwd(), "datasets", dataset, `${dataset}_kmeans.json`);

  // If Docker raw exists, assume Docker environment for all files
  if (fs.existsSync(dockerRaw)) {
    return {
      raw: dockerRaw,
      normalized: dockerNorm,
      kmeans: dockerKMeans,
      env: "docker"
    };
  }

  // Otherwise use local paths (ensure local dataset dir exists)
  const datasetDir = path.join(process.cwd(), "datasets", dataset);
  fs.mkdirSync(datasetDir, { recursive: true });

  return {
    raw: localRaw,
    normalized: localNorm,
    kmeans: localKMeans,
    env: "local"
  };
}
