Prima Veritas OSS — Release & Tagging Guide

Prima Veritas OSS uses Semantic Versioning (SemVer):

MAJOR.MINOR.PATCH  →  v0.1.0, v0.1.1, v0.2.0, etc.


This guide defines when a version should change and how to tag a new release.

1. What Defines a Release?

A version bump is required whenever any change affects the deterministic pipeline or its outputs.

PATCH — v0.1.0 → v0.1.1

Use for small corrections that do not change deterministic outputs.

Examples:

typo fixes in code or docs

formatting cleanup

adding README examples

improving error messages

Outputs (normalized JSON + KMeans results) must remain bit-for-bit identical.

MINOR — v0.1.0 → v0.2.0

Use for new deterministic features that do not alter existing outputs.

Examples:

adding deterministic PCA

adding deterministic HCLUST

new canonical transforms

adding new datasets

Existing datasets (iris, wine) must still match established golden hashes.

MAJOR — v0.x → v1.0

Use only when the core deterministic architecture changes, including:

changes to normalization logic

changes to analytics algorithms

changes to output formats

regeneration of golden hashes

This should be extremely rare.

2. Files That Define a Release

Changes to the following files require a version bump:

runners/codice_fullproof.mjs
runners/deterministic_kmeans.mjs
transforms/canonical_transform.mjs
datasets/<dataset>/<dataset>_raw.csv
docker/Dockerfile
tools/hashcheck.mjs
tools/fitgen_runtime_digest_builder.mjs


Changes in documentation only do not require a version bump.

3. Determinism Checklist Before Tagging

Before creating a release, perform the following:

1. Rebuild Docker
docker build -t prima-veritas-oss -f docker/Dockerfile .

2. Run both datasets
docker run --rm prima-veritas-oss iris
docker run --rm prima-veritas-oss wine

3. Validate hashes
node tools/hashcheck.mjs iris
node tools/hashcheck.mjs wine

Confirm:

✔ Outputs match golden hashes

✔ FITGEN digest builds cleanly

✔ No uncommitted changes remain

If all pass → proceed to tagging.

4. How to Tag a Release
Initial release
git add .
git commit -m "Release v0.1.0 — deterministic KMeans + canonical transforms"
git tag -a v0.1.0 -m "Prima Veritas OSS v0.1.0"
git push origin main --tags

Patch release
git tag -a v0.1.1 -m "Patch release — docs + cleanup"
git push origin main --tags

5. How Contributors Trigger a Version

When submitting a PR:

If outputs do not change → no version bump

If outputs change but remain deterministic → MINOR bump

If outputs break determinism or modify canonical rules → PR blocked unless explicitly justified

This ensures Prima Veritas OSS remains stable, auditable, and credibly deterministic.

END OF RELEASE_TAGS.md