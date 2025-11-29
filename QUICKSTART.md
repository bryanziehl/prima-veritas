🚀 Quickstart — Prima Veritas OSS (Deterministic Pipeline)

Run the fully deterministic Prima Veritas OSS pipeline with Docker. All outputs are bit-for-bit identical across machines.

1. Build the Docker Image (Required)

From the repo root:

docker build -t prima-veritas-oss -f docker/Dockerfile .


This produces a sealed, deterministic environment with:

pinned Node 18.20.0

deterministic normalization

deterministic KMeans

zero nondeterministic dependencies

isolated filesystem reproducibility

2. Run the Deterministic Pipeline

The container requires a bind-mount so outputs are written back into your repo under datasets/.

Mac / Linux
# Run Iris
docker run -it --rm \
  -v $(pwd)/datasets:/app/datasets \
  prima-veritas-oss iris

# Run Wine
docker run -it --rm \
  -v $(pwd)/datasets:/app/datasets \
  prima-veritas-oss wine

Windows (PowerShell)

(✓ correct for Docker Desktop, ✓ correct line-continuation, ✓ ${PWD} resolves properly)

# Run Iris
docker run -it --rm `
  -v ${PWD}\datasets:/app/datasets `
  prima-veritas-oss iris

# Run Wine
docker run -it --rm `
  -v ${PWD}\datasets:/app/datasets `
  prima-veritas-oss wine

3. Output Locations

Each deterministic run produces:

datasets/<dataset>/<dataset>_normalized.json
datasets/<dataset>/<dataset>_kmeans.json


Examples:

datasets/iris/iris_normalized.json
datasets/iris/iris_kmeans.json

datasets/wine/wine_normalized.json
datasets/wine/wine_kmeans.json


The pipeline also creates or updates the aggregated runtime digest:

reports/FITGEN_RUNTIME_DIGEST.json


Built using:

tools/fitgen_runtime_digest_builder.mjs


It merges digest files from:

reports/digests/

4. Determinism Guarantee

These commands:

docker run --rm prima-veritas-oss iris
docker run --rm prima-veritas-oss wine


will always produce bit-for-bit identical outputs matching the golden hashes published in the v0.1.0 release.

To verify:

node tools/hashcheck.mjs iris
node tools/hashcheck.mjs wine


If both report ✔ MATCH, then your environment is:

reproducible

sealed

deterministic

fully aligned with Prima Veritas OSS v0.1.0