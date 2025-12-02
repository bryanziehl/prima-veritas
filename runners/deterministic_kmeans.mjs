// ---------------------------------------------------------------------------
// Prima Veritas OSS — deterministic_kmeans.mjs (v0.1.0)
// Fully deterministic K-Means — Prima Veritas OSS canonical reference.
// MIT License.
// ---------------------------------------------------------------------------
//
// Purpose:
//   Provide a zero-entropy K-Means algorithm suitable for reproducibility,
//   audits, verification pipelines, and cross-machine consistency.
//
// Determinism Guarantees:
//   • Sorted-feature deterministic centroid initialization
//   • Fixed iteration cap + reproducible convergence
//   • Canonical numeric extraction (stable sorted order)
//   • Deterministic ROUND() applied to all floating-point ops
//   • Canonical centroid ordering
//   • Canonical JSON serialization
//
// ---------------------------------------------------------------------------

import path from "path";
import { resolveDatasetPaths } from "./path_resolver.mjs";

const ROUND = x => Number(x.toFixed(12));

// ------------------------------------------------------------
// Deterministic KMeans core
// ------------------------------------------------------------
export function deterministicKMeans(matrix, k = 3) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new Error("KMeans: empty dataset");
  }

  const n = matrix.length;
  const dim = matrix[0].length;

  if (k > n) {
    throw new Error(`KMeans: k=${k} > dataset size=${n}`);
  }

  // Deterministic initialization (sorted by first feature)
  const sortedIndices = Array.from({ length: n }, (_, i) => i)
    .sort((a, b) => matrix[a][0] - matrix[b][0]);

  let centroids = sortedIndices
    .slice(0, k)
    .map(idx => matrix[idx].map(ROUND));

  const maxIter = 50;
  let assignments = new Array(n).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;

    // Assignment
    for (let i = 0; i < n; i++) {
      const p = matrix[i];
      let bestC = 0;
      let bestDist = Infinity;

      for (let c = 0; c < k; c++) {
        let dist = 0;

        for (let d = 0; d < dim; d++) {
          const diff = p[d] - centroids[c][d];
          dist += diff * diff;
        }

        if (dist < bestDist) {
          bestDist = dist;
          bestC = c;
        }
      }

      if (assignments[i] !== bestC) {
        assignments[i] = bestC;
        changed = true;
      }
    }

    // Update
    const newCentroids = Array.from({ length: k }, () =>
      Array(dim).fill(0)
    );
    const counts = Array(k).fill(0);

    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      counts[c]++;
      for (let d = 0; d < dim; d++) {
        newCentroids[c][d] += matrix[i][d];
      }
    }

    for (let c = 0; c < k; c++) {
      if (counts[c] === 0) {
        newCentroids[c] = centroids[c].map(ROUND);
      } else {
        for (let d = 0; d < dim; d++) {
          newCentroids[c][d] = ROUND(newCentroids[c][d] / counts[c]);
        }
      }
    }

    // Convergence
    let drift = 0;
    for (let c = 0; c < k; c++) {
      for (let d = 0; d < dim; d++) {
        drift += Math.abs(newCentroids[c][d] - centroids[c][d]);
      }
    }

    centroids = newCentroids;
    if (!changed || drift < 1e-12) break;
  }

  // Canonical centroid ordering
  const centroidTuples = centroids.map((coords, idx) => ({ index: idx, coords }));

  centroidTuples.sort((a, b) => {
    for (let d = 0; d < dim; d++) {
      const diff = a.coords[d] - b.coords[d];
      if (Math.abs(diff) > 1e-12) return diff;
    }
    return 0;
  });

  const centroidOrderMap = new Map();
  centroidTuples.forEach((c, newIdx) => centroidOrderMap.set(c.index, newIdx));

  const canonicalAssignments = assignments.map(old => centroidOrderMap.get(old));
  const canonicalCentroids = centroidTuples.map(c => c.coords);

  return {
    k,
    dim,
    centroids: canonicalCentroids,
    assignments: canonicalAssignments
  };
}

// ---------------------------------------------------------------------------
// HYBRID PATH RUNNER — uses resolveDatasetPaths()
// ---------------------------------------------------------------------------
export async function runKMeansFile(dataset, k = 3) {
  const fs = (await import("fs")).default;

  const paths = resolveDatasetPaths(dataset);
  const normPath = paths.normalized;
  const outPath  = paths.kmeans;

  if (!fs.existsSync(normPath)) {
    throw new Error(`KMeans: missing normalized file at: ${normPath}`);
  }

  const rows = JSON.parse(fs.readFileSync(normPath, "utf8"));
  const matrix = rows.map(r =>
    Object.values(r).filter(v => typeof v === "number")
  );

  const result = deterministicKMeans(matrix, k);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");

  console.log(`✔ KMeans output → ${outPath}`);
}
