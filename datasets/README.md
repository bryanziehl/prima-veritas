datasets — Benchmark Dataset Inputs

This directory contains the benchmark datasets used by the deterministic
ingest → normalize → analyze pipeline.

Directory Structure
datasets/
   iris/
      iris_raw.csv
      iris_normalized.json
      iris_kmeans.json

   wine/
      wine_raw.csv
      wine_normalized.json
      wine_kmeans.json

File Types
*_raw.csv

Unmodified benchmark dataset inputs.
These are the canonical dataset sources.

*_normalized.json

Outputs produced by the deterministic normalization engine.
Includes canonical field ordering, numeric coercions, and null cleanup.

*_kmeans.json

Outputs produced by the deterministic KMeans module.
Includes validated centroids and stable assignments.

None of these files are hand-edited.
They must remain unchanged to preserve reproducibility and golden hash validity.

Workflow Integration

All dataset files in this directory are generated or consumed by:

runners/codice_fullproof.mjs

Docker workflow via:

docker run --rm prima-veritas-oss iris
docker run --rm prima-veritas-oss wine

Important Notes

Users must not modify any files within datasets/iris/ or datasets/wine/.

Any change to normalized or kmeans outputs will break determinism and invalidate golden hashes.

New datasets may be added only through formal contribution rules (see CONTRIBUTING.md).

If this looks good, tell me which README to polish next.

You said:
don im confused how come youre not using any ### stuff on this README?

ChatGPT said:

Ah — great catch.
I matched your input exactly because you didn’t include any headings beyond the top title. I kept your structure verbatim so I didn’t accidentally reorganize or over-style it if you were aiming for minimalism.

But yes:
Every README in this repo should follow the same visual grammar:

# for the page title

## for sections

### for subsections

clean horizontal rhythm

scanner-friendly chunks

So let me rewrite it properly, using the same heading structure as the main README, ARCHITECTURE.md, tests README, etc.

datasets — Benchmark Dataset Inputs

This directory contains the benchmark datasets used by the deterministic
ingest → normalize → analyze pipeline.

Directory Structure
datasets/
   iris/
      iris_raw.csv
      iris_normalized.json
      iris_kmeans.json

   wine/
      wine_raw.csv
      wine_normalized.json
      wine_kmeans.json

File Types
*_raw.csv

Unmodified benchmark dataset inputs.
These are the canonical public-domain datasets used for deterministic validation.

*_normalized.json

Produced by the deterministic normalization engine.
Includes canonical field ordering, type coercion, and null cleanup.

*_kmeans.json

Produced by the deterministic KMeans module.
Includes validated centroids and stable assignments.

Important:
None of these files are hand-edited.
They must remain unchanged to preserve reproducibility and golden hash validity.

Workflow Integration

These files are generated or consumed by:

runners/codice_fullproof.mjs

The Docker workflow:

docker run --rm prima-veritas-oss iris
docker run --rm prima-veritas-oss wine

Contribution Notes

Users must not modify any files inside datasets/iris/ or datasets/wine/.

Any modification will break deterministic guarantees and invalidate official golden hashes.

New datasets may be added only through the rules defined in CONTRIBUTING.md.