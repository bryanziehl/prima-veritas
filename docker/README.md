🐳 Deterministic Docker Environment

This directory contains the runtime shell script and documentation for the Prima Veritas OSS deterministic Docker environment.

The container provides:

Pinned Node 18.20.0

Zero nondeterministic dependencies

Clean, isolated filesystem

Deterministic ingest, normalization, and KMeans

Bit-for-bit identical outputs across machines

📁 Files
run_fullproof.sh

Entrypoint executed inside the container.

Responsibilities:

Print container + Node version

Parse dataset argument (iris, wine)

Execute the deterministic pipeline:

node runners/codice_fullproof.mjs <dataset>


Write outputs to /app/datasets/<dataset>/

Exit cleanly

🚀 Build the Docker Image

(Run from the repository root)

docker build -t prima-veritas-oss .


This produces the sealed deterministic environment.

▶️ Run the Deterministic Pipeline

The container requires a dataset bind-mount to write outputs back into the repo.

Mac / Linux
docker run -it --rm \
  -v $(pwd)/datasets:/app/datasets \
  prima-veritas-oss iris

docker run -it --rm \
  -v $(pwd)/datasets:/app/datasets \
  prima-veritas-oss wine

Windows PowerShell
docker run -it --rm `
  -v ${PWD}\datasets:/app/datasets `
  prima-veritas-oss iris

docker run -it --rm `
  -v ${PWD}\datasets:/app/datasets `
  prima-veritas-oss wine

📦 Output Locations

Each run generates:

datasets/<dataset>/<dataset>_normalized.json
datasets/<dataset>/<dataset>_kmeans.json


And updates:

reports/FITGEN_RUNTIME_DIGEST.json

✔ Determinism Guarantee

Running:

docker run --rm prima-veritas-oss iris
docker run --rm prima-veritas-oss wine


will always produce outputs matching the official Prima Veritas OSS golden hashes.

To verify:

node tools/hashcheck.mjs iris
node tools/hashcheck.mjs wine


A correct environment reports:

normalized → ✔ MATCH
kmeans     → ✔ MATCH