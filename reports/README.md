reports — Output Artifacts

This directory contains output artifacts produced or referenced by the Prima Veritas OSS deterministic pipeline.
These files illustrate how normalized data, deterministic analytics, and merged digest outputs may be stored and inspected.

Contents
FITGEN_RUNTIME_DIGEST.json

A unified JSON digest produced by the sample fitgen_runtime_digest_builder.mjs tool.
It aggregates all digest_*.txt files found under reports/digests/.

digests/

A folder containing illustrative plain-text digest files (digest_test1.txt, digest_test2.txt).
These demonstrate how external digest files can be merged but are not part of the core deterministic pipeline for v0.1.

Notes

These artifacts are provided for transparency and demonstration.

FITGEN_RUNTIME_DIGEST.json is deterministic when produced from stable input digests.

The text digest files under reports/digests/ are not used during the deterministic KMeans or normalization runs.

Downstream forks may extend, replace, or automate this directory as needed.