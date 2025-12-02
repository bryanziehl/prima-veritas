# 🚀 Quickstart — Prima Veritas OSS (Deterministic Pipeline)

<p align="center">
  <img src="./assets/flow_charts/deterministic_ingestion_chain.png" alt="Deterministic Ingestion Pipeline" width="100%" />
</p>

Run the fully deterministic Prima Veritas OSS pipeline using Docker.
All outputs are bit-for-bit identical across all machines.

🔧 Prerequisites

Before running Prima Veritas OSS, ensure the following:

1. Docker (required)

Install Docker Desktop for your platform:

Windows: https://docs.docker.com/desktop/install/windows/

macOS: https://docs.docker.com/desktop/install/mac-install/

Linux: https://docs.docker.com/engine/install/

Verify installation:

docker --version

2. Git (optional, recommended)

If cloning the repository:
https://git-scm.com/downloads

1. Build the Docker Image (Required)

From the repo root:

docker build -t prima-veritas-oss -f Dockerfile .


This produces a sealed deterministic environment with:

Pinned Node 18.20.0

Deterministic normalization

Deterministic KMeans

Zero nondeterministic dependencies

Isolated filesystem reproducibility

2. Run the Deterministic Pipeline

The container requires a bind-mount so outputs are written into your repo under datasets/.

Mac / Linux

Run Iris

docker run -it --rm \
  -v $(pwd)/datasets:/app/datasets \
  prima-veritas-oss iris


Run Wine

docker run -it --rm \
  -v $(pwd)/datasets:/app/datasets \
  prima-veritas-oss wine

Windows (PowerShell)

(✓ correct for Docker Desktop, ✓ ${PWD} expansion, ✓ working line syntax)

Run Iris

docker run -it --rm `
  -v ${PWD}\datasets:/app/datasets `
  prima-veritas-oss iris


Run Wine

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


The pipeline also updates the deterministic digest file:

reports/FITGEN_RUNTIME_DIGEST.json


Generated via:

tools/fitgen_runtime_digest_builder.mjs


It merges all digest files under:

reports/digests/

4. Determinism Guarantee

These commands:

docker run --rm prima-veritas-oss iris
docker run --rm prima-veritas-oss wine


must produce outputs that match the v0.1.0 golden hashes.

To verify:

node tools/hashcheck.mjs iris
node tools/hashcheck.mjs wine


Correct execution prints:

normalized → ✔ MATCH
kmeans     → ✔ MATCH


Your environment is now:

reproducible

sealed

deterministic

fully aligned with Prima Veritas OSS v0.1.0

📘 Want the full deterministic pipeline?

Full architecture, module details, and diagrams are available in:

➡ README.md