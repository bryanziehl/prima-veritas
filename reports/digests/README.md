digests — Sample Digest Files

This directory contains example digest artifacts for the Prima Veritas OSS pipeline.
For v0.1, these files are illustrative only and are not consumed by the core Docker fullproof execution.

They demonstrate the formatting and structure expected by external digest aggregation tools.

Contents
digest_test1.txt

A plain-text sample digest containing a mock hash and timestamp, formatted using the standard digest schema.

digest_test2.txt

A second sample digest demonstrating identical formatting rules, useful for testing multi-file aggregation.

Purpose

These files exist solely to illustrate how arbitrary digest files can be merged into a unified JSON summary using:

tools/fitgen_runtime_digest_builder.mjs


They are not part of the deterministic pipeline, and modifying or removing them does not affect reproducibility.