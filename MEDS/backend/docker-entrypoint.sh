#!/bin/sh
set -e

echo "-> Entry point: build and optional seed runner"

# Build TypeScript to dist if present
if [ -f package.json ]; then
  echo "-> Installing dependencies (already done in Dockerfile layer)"
fi

if [ -f package.json ]; then
  echo "-> Running build"
  npm run build || echo "Build failed but continuing"
fi

# Run seeds if requested. Default: run on Render (RENDER env var) or if RUN_SEEDS=true
if [ "${RUN_SEEDS}" = "true" ] || [ "${RENDER}" = "true" ]; then
  echo "-> Running seed script (npm run seed)"
  npm run seed || echo "Seed script failed"
else
  echo "-> Skipping seeds (set RUN_SEEDS=true to enable)"
fi

echo "-> Starting application"
exec npm run start
