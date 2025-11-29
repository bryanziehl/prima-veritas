#!/bin/sh
# ---------------------------------------------------------------------------
# Prima Veritas OSS — run_fullproof.sh
# Deterministic Docker Entrypoint (MIT License)
# ---------------------------------------------------------------------------
#
# Purpose:
#   This script is the container entrypoint for Prima Veritas OSS v0.1.0.
#   It executes the full deterministic pipeline:
#
#       raw CSV → canonical normalization → deterministic KMeans → outputs
#
#   All operations run in a sealed, pinned Node 18 environment inside Docker.
#   Every execution produces *bit-for-bit identical artifacts*.
#
# Usage (inside container):
#       ./run_fullproof.sh <iris|wine>
#
# Behavior:
#   • Defaults to dataset "iris" if no argument is provided
#   • Runs the top-level orchestrator (codice_fullproof.mjs)
#   • Writes outputs to /app/datasets/<dataset>/ (bind-mounted to host)
#
# Determinism Guarantees:
#   • Zero randomness or nondeterministic branching
#   • No timestamps, locale effects, or environment leakage
#   • Canonical transforms, stable JSON formatting, fixed-order execution
#
# Notes:
#   • This script is *only* intended to run inside the Docker container.
#   • The deterministic environment is defined in docker/Dockerfile.
#
# ---------------------------------------------------------------------------


echo "🔥 CODICE OSS — Container started"
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "Running fullproof…"

# Detect dataset parameter, default to iris
DATASET="${1:-iris}"

echo "Dataset selected: $DATASET"

node runners/codice_fullproof.mjs "$DATASET"

echo "✔ Fullproof run complete"
echo "✔ Exiting container"
