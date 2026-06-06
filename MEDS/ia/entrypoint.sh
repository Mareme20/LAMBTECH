#!/bin/sh
set -e

# Interval in seconds between runs (default 1 hour)
INTERVAL=${ML_INTERVAL:-3600}

cd /usr/src/ia || exit 1

echo "[IA] Starting entrypoint. Running every ${INTERVAL}s"

PY_BIN="$(command -v python3 || true)"
if [ -z "$PY_BIN" ]; then
  echo "[IA] Python3 not found in PATH"
  exit 1
fi

while true; do
  echo "[IA] Running prediction: $(date)"
  if [ -f prediction/prediction.py ]; then
    "$PY_BIN" prediction/prediction.py || echo "[IA] prediction.py exited with error"
  else
    echo "[IA] prediction.py not found"
  fi

  if [ -f prediction/visualisation.py ]; then
    "$PY_BIN" prediction/visualisation.py || echo "[IA] visualisation.py exited with error"
  fi

  echo "[IA] Sleeping for ${INTERVAL}s"
  sleep ${INTERVAL}
done
