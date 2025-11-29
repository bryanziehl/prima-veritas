transforms — Canonical Normalization Logic

This directory contains the deterministic field-level normalization modules used by Prima Veritas OSS.
All transforms are dataset-agnostic, pure, and side-effect-free, ensuring that raw records always reduce to the same canonical structure on any machine.

Contents
canonical_transform.mjs

Core canonicalization routine applied during normalization.

Provides:

Deterministic key sorting (lexicographic)

Stable whitespace trimming

Numeric-string → number coercion

Null-ish value normalization

Pure, stateless transformations

Bit-for-bit stable JSON output

This module is invoked by deterministic_normalize.mjs and forms the backbone of the ingest → normalize → analyze pipeline’s reproducibility guarantees.

Determinism Requirements

All transforms in this directory must remain:

Pure functions (no side effects)

Free of randomness

Free of timestamps

Independent of locale, timezone, and environment

Stable across Node versions

Dataset-agnostic (no dataset-specific hacks or exceptions)

Any change here impacts the canonical form and therefore affects reproducibility.