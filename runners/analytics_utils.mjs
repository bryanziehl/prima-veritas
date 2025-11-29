// ---------------------------------------------------------------------------
// Prima Veritas OSS — analytics_utils.mjs
// Deterministic shared utilities for analytic modules.
// MIT License.
// ---------------------------------------------------------------------------
//
// Purpose:
//   Provide small, pure, deterministic building blocks used by analytic
//   routines (e.g., KMeans, PCA, clustering kernels). These helpers
//   enforce stable numeric extraction and matrix operations independent
//   of runtime environment.
//
// Determinism Guarantees:
//   • extractNumericMatrix()
//       - lexicographically sorted keys
//       - stable row iteration
//       - numeric-only extraction (no heuristics)
//       - identical output across machines for identical inputs
//
//   • transpose()
//       - stable index iteration
//       - deterministic shape and layout
//
//   • matMul()
//       - fixed-order multiply/add loops
//       - no BLAS, SIMD, or hardware-accelerated backends
//       - results immune to hardware-level floating-point variation
//
// Contributor Notes:
//   All functions here must remain:
//     - pure,
//     - synchronous,
//     - stateless,
//     - free from randomness,
//     - independent of locale, time, and machine-specific factors.
//
//   If adding new matrix ops (e.g., norms, projections, covariance),
//   ensure that the implementation avoids:
//     - platform-optimized math libraries,
//     - non-deterministic aggregation,
//     - parallelism,
//     - float rounding drift without explicit control.
//
//

/**
 * Extract a numeric matrix from a normalized dataset.
 * Deterministic ordering:
 *   - lexicographically sorted keys
 *   - stable row iteration
 *   - non-numeric fields ignored
 */
export function extractNumericMatrix(normalizedData) {
  if (!Array.isArray(normalizedData) || normalizedData.length === 0) {
    throw new Error("extractNumericMatrix: dataset empty or invalid.");
  }

  const sample = normalizedData[0];
  const keys = Object.keys(sample).sort();

  const numericKeys = keys.filter(k => typeof sample[k] === "number");

  const matrix = normalizedData.map(row => {
    return numericKeys.map(k => {
      const v = row[k];
      return typeof v === "number" ? v : 0;
    });
  });

  return { matrix, numericKeys };
}

/**
 * Deterministic transpose
 */
export function transpose(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const out = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out[c][r] = matrix[r][c];
    }
  }

  return out;
}

/**
 * Deterministic matrix multiply
 */
export function matMul(A, B) {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  if (colsA !== rowsB) {
    throw new Error("matMul: incompatible matrix sizes.");
  }

  const out = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

  for (let r = 0; r < rowsA; r++) {
    for (let c = 0; c < colsB; c++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[r][k] * B[k][c];
      }
      out[r][c] = sum;
    }
  }
  return out;
}
