tools — Auxiliary Utilities

This directory contains lightweight helper scripts that support digest aggregation, reproducibility validation, and artifact verification for Prima Veritas OSS.

These modules do not participate directly in normalization or KMeans analytics.
They exist to demonstrate deterministic validation patterns and external digest workflows.

Contents
fitgen_runtime_digest_builder.mjs

Aggregates all plain-text digest files under:

reports/digests/


and produces a combined machine-readable summary:

reports/FITGEN_RUNTIME_DIGEST.json


Intended to illustrate how external systems can merge digest artifacts into a unified canonical output.

hashcheck.mjs

Deterministic output verification utility.

Compares your local dataset outputs against the official golden hashes published in the v0.1.0 release.

Usage
node tools/hashcheck.mjs iris
node tools/hashcheck.mjs wine


Reports:

✔ MATCH — your outputs are bit-for-bit identical

❌ MISMATCH — a drift occurred (nondeterminism or tampering)

Recommended before:

Publishing a release

Tagging a version

Submitting a pull request

Demonstrating reproducibility to reviewers or partners

Notes

Utilities in this directory are optional and illustrative.

Downstream forks may extend, replace, or integrate these scripts into larger verification workflows.

These tools help ensure that the Prima Veritas OSS pipeline remains transparent, auditable, and reproducible across machines.