#!/bin/bash

echo "=== Prima Veritas — Mobile Ingest Demo (bash) ==="

echo "[1] Environment check…"
node -v || { echo "Node not found. Exiting."; exit 1; }

REPO="$HOME/CAVIRA_TOOLSTACK_MASTER/PRIMA_VERITAS_OSS"
echo "[2] Switching to repo directory: $REPO"
cd "$REPO" || { echo "Repo path not found."; exit 1; }

echo "[3] Clearing old datasets..."
rm -f datasets/iris/iris_normalized.json
rm -f datasets/iris/iris_kmeans.json

echo "[4] Running deterministic ingest..."
node tools/hashcheck.mjs iris || {
    echo "Ingest failed."
    exit 1
}

echo "[5] FITGEN digest:"
cat reports/FITGEN_RUNTIME_DIGEST.json

echo "=== SUCCESS: Mobile-triggered ingest completed ==="
