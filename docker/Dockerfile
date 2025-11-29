# -----------------------------------------------------------------------------
# Prima Veritas OSS — Deterministic Kernel Container
# Node 18 LTS (pinned) for reproducibility and stable CI environments.
# -----------------------------------------------------------------------------

FROM node:18.20.0-slim

# Set working directory inside container
WORKDIR /app

# Copy core system directories explicitly for clarity & determinism
COPY transforms/   /app/transforms/
COPY runners/      /app/runners/
COPY datasets/     /app/datasets/
COPY tools/        /app/tools/
COPY docker/       /app/docker/
COPY reports/      /app/reports/
COPY tests/        /app/tests/

# Copy markdown docs + license
COPY *.md    /app/
COPY LICENSE /app/

# Copy package.json IF PRESENT (legal Docker syntax)
COPY package*.json /app/

# Install node modules only if package.json exists
RUN if [ -f package.json ]; then npm install --omit=dev; fi

# Ensure fullproof runner is executable
RUN chmod +x /app/docker/run_fullproof.sh

# Entry point allows dataset selection:
#   docker run prima-veritas-oss iris
#   docker run prima-veritas-oss wine
ENTRYPOINT ["bash", "/app/docker/run_fullproof.sh"]
