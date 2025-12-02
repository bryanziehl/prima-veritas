ARCHITECTURE.md — Prima Veritas OSS

A minimal, deterministic pipeline for reproducible analytics.

Prima Veritas OSS implements a sealed ingest → normalize → analyze workflow designed to produce bit-for-bit identical outputs across machines, operating systems, and runs.
This document provides a high-level architecture map for contributors, researchers, and auditors.

1. Pipeline Overview
┌────────────┐
│   Raw CSV  │
└─────┬──────┘
      │ 1. Ingest
      ▼
┌────────────────────────┐
│ Normalize              │  deterministic_normalize.mjs
│ + Canonical Transform  │  canonical_transform.mjs
└─────┬──────────────────┘
      │ 2. Canonical JSON (stable ordering)
      ▼
┌────────────┐
│ Analytics  │  deterministic_kmeans.mjs
└─────┬──────┘
      │ 3. Deterministic KMeans
      ▼
┌──────────────────────────────┐
│  Deterministic Outputs       │  iris_kmeans.json / wine_kmeans.json
└──────────────────────────────┘


Every stage is strictly deterministic:

Sorted field names

Stable row iteration

Stable numeric coercion

No timestamps

No randomness

No environment-dependent behavior

## 2. Directory Architecture

```
prima_veritas_oss/
│
├── assets/                      # OSS-safe brand assets (SVG + PNG logos)
│   └── Color logo with background.svg
│
├── datasets/                    # Raw CSV + normalized JSON + deterministic outputs
│   ├── iris/
│   └── wine/
│
├── demo_scripts/                # Optional demo workflows (e.g., mobile ingest)
│   └── mobile_ingest/           # iPhone → SSH deterministic ingest demo
│
├── reports/                     # FITGEN_RUNTIME_DIGEST + sample digest artifacts
│
├── runners/                     # codice_fullproof orchestrator + deterministic runners
│
├── tests/                       # Full deterministic test suite (all tests passing)
│
├── tools/                       # FITGEN digest builder, hashcheck, misc utilities
│
├── transforms/                  # canonical_transform + normalization logic
│
├── .dockerignore                # Docker build context filtering
├── .editorconfig                # Formatting standards
│
├── ARCHITECTURE.md              # System architecture + determinism chain
├── CHANGELOG.md                 # Version history
├── CONTRIBUTING.md              # Determinism guardrails for contributors
├── LICENSE                      # MIT license (project-wide)
├── package.json                 # Node project definition
├── QUICKSTART.md                # Minimal run instructions
├── README.md                    # Main project overview + commands
├── RELEASE_TAGS.md              # Release tagging conventions
├── SECURITY.md                  # Security disclosure guidelines
│
└── Dockerfile                   # Root-level Dockerfile used for deterministic runs



This structure emphasizes:

Transparency

One-function-per-file clarity

Easy navigation

Auditable deterministic flow

3. Execution Flow (Inside Docker)

Default dataset (Iris):

docker run --rm prima-veritas-oss


Select dataset explicitly:

docker run --rm prima-veritas-oss wine


Internal flow:

run_fullproof.sh
  → node runners/codice_fullproof.mjs <dataset>
       → Normalize
       → Deterministic KMeans
       → Write outputs to /app/datasets/<dataset>/

4. Deterministic Normalization

Handled by:

transforms/canonical_transform.mjs

runners/deterministic_normalize.mjs

Guarantees:

Ordered field names

Stable numeric coercion

Null normalization

Removal of machine variance

Pure, stateless transformations

5. Deterministic Analytics

Handled by:

runners/deterministic_kmeans.mjs

Properties:

Fixed deterministic initialization

Fixed assignment order

Fixed centroid update order

Stable floating-point math

Deterministic write via writeDeterministicJSON()

Outputs sealed to:

datasets/<dataset>/<dataset>_kmeans.json

6. Determinism Principles

Prima Veritas adheres to strict reproducibility:

NO:

Random seeds

Timestamps

System clocks

Locale drift

Multi-thread nondeterminism

Nondeterministic dependencies

File-order nondeterminism

YES:

Pure functions

Sorted operations

Stable numeric routines

Sealed Docker environment

Bit-for-bit reproducibility

7. Contributor Notes

All transforms must remain pure

No dataset-specific logic inside canonical transforms

No environment metadata introduced

Analytics modules must remain 100% stateless

JSON loaders/writers must remain deterministic

Status

Prima Veritas OSS v0.1.0 has passed:

✔ Iris reproducibility

✔ Wine reproducibility

✔ Cross-machine deterministic validation (Laptop A + Laptop B + Docker)

The system is ready for peer review and deterministic algorithm extensions.