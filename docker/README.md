docker — Deterministic Execution Environment

This directory contains the fully reproducible Docker environment used to run the Prima Veritas OSS deterministic pipeline.

The container guarantees:

Pinned Node version: Node 18 LTS (node:18.20.0-slim)

Zero nondeterministic dependencies

Clean, isolated filesystem identical across machines

Direct CLI dataset selection (iris, wine, future datasets)

This eliminates machine variance and ensures all users produce bit-for-bit identical normalized JSON and KMeans outputs.

Files
Dockerfile

Builds the deterministic runtime environment.

It:

Copies the full OSS repo into /app

Installs dependencies deterministically (npm ci or npm install)

Ensures runner scripts are executable

Sets the container’s deterministic entrypoint

Pins Node and all dependencies

run_fullproof.sh

Executed inside the container on startup.

Responsibilities:

Prints container + Node version

Detects dataset argument (defaults to iris)

Runs:

node runners/codice_fullproof.mjs <dataset>


Exits cleanly once outputs are generated

Usage
Build
docker build -t prima-veritas-oss -f docker/Dockerfile .

Run (default dataset: iris)
docker run --rm prima-veritas-oss

Run wine
docker run --rm prima-veritas-oss wine

Run with mounted datasets (recommended for development)
docker run --rm \
  -v "$(pwd)/datasets:/app/datasets" \
  prima-veritas-oss iris


Windows PowerShell equivalent:

docker run --rm `
  -v ${PWD}\datasets:/app/datasets `
  prima-veritas-oss iris

Notes

This container is the recommended execution path for all reproducibility testing.

Native Node execution is possible but not officially supported and may introduce nondeterministic drift.

The pinned Node version + isolated filesystem form the backbone of the deterministic guarantee.