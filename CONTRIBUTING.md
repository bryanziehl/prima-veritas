Contributing to Prima Veritas OSS

Thank you for your interest in contributing.
Prima Veritas OSS is a clear, auditable reference implementation of deterministic analytics.

This document explains how to contribute safely without introducing nondeterminism or drift into the pipeline.

1. Project Philosophy

All contributions must align with the core goals:

deterministic execution

bit-for-bit reproducible outputs

transparent, minimal code

dataset-agnostic logic

pure functions, no side effects

no randomness, timestamps, or environment-dependent behavior

Anything that violates determinism cannot be merged.

2. Code of Conduct

Be respectful.

Be clear.

Be collaborative.

This project follows the spirit of the Contributor Covenant without added bureaucracy.

3. How to Contribute

Three contribution paths are always safe:

A. Improve Documentation

You may freely edit:

README.md

QUICKSTART.md

ARCHITECTURE.md

folder-level READMEs

Documentation improvements are always welcome.

B. Add Deterministic Modules

You may contribute deterministic implementations of:

PCA

HCLUST

regression models

additional clustering algorithms

new canonical transforms

All such modules must satisfy:

no randomness

no unstable library calls

fixed iteration order

stable floating-point behavior

stateless, pure function design

C. Add Datasets

You may add datasets if:

they are open/public domain

the raw CSV is included under /datasets/<name>/

no dataset-specific hacks are required

normalization and analytics produce deterministic outputs

golden hashes can be verified

4. Do Not Submit

The following changes will be rejected automatically:

algorithms requiring randomness

nondeterministic ordering (e.g., unordered maps)

multi-threaded logic without guaranteed ordering

filesystem writes based on system time or environment

dataset-specific branches in canonical transforms

dependencies that introduce nondeterminism

code that changes output formats without justification

If in doubt: open an Issue first.

5. Development Workflow

Clone and build:

git clone https://github.com/<yourname>/prima_veritas_oss
cd prima_veritas_oss
docker build -t prima-veritas-oss -f docker/Dockerfile .


Run deterministic pipelines:

docker run --rm prima-veritas-oss iris
docker run --rm prima-veritas-oss wine


Validate hashes:

node tools/hashcheck.mjs iris
node tools/hashcheck.mjs wine


Outputs must match Golden Hashes exactly.

6. Submitting a Pull Request

Before submitting a PR:

ensure Docker builds successfully

ensure both Iris and Wine reproduce Golden Hashes

verify FITGEN_RUNTIME_DIGEST.json builds cleanly

provide a brief, clear description of the change

include reproducibility notes if needed

avoid adding dependencies unless necessary

PRs that break determinism will be declined immediately.

7. Versioning

Prima Veritas OSS follows Semantic Versioning:

MAJOR — breaking changes

MINOR — new deterministic algorithms/features

PATCH — fixes, docs, minor improvements

8. License

By contributing, you agree that your contributions are licensed under the
MIT License of this repository.