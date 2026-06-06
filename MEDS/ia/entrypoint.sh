#!/bin/sh
set -e

# Entrypoint: exécute le script ML en boucle (toutes les 6 heures)
IA_DIR="$(cd "$(dirname "$0")" && pwd)"
PY_BIN="$IA_DIR/venv/bin/python3"

if [ ! -x "$PY_BIN" ]; then
  echo "[IA] Virtualenv python introuvable, utilisation du python système"
  PY_BIN="python3"
fi

while true; do
  echo "[IA] Démarrage du moteur ML: $(date)"
  # Exécute directement les scripts Python (fallback si le run_ml_engine.sh attend un venv)
  if [ -f "$IA_DIR/prediction/prediction.py" ]; then
    "$PY_BIN" "$IA_DIR/prediction/prediction.py" || echo "[IA] prediction.py a échoué"
  fi
  if [ -f "$IA_DIR/prediction/visualisation.py" ]; then
    "$PY_BIN" "$IA_DIR/prediction/visualisation.py" || echo "[IA] visualisation.py a échoué"
  fi
  echo "[IA] Attente 6 heures avant la prochaine exécution"
  sleep 21600
done
