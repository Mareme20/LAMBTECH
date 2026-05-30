#!/bin/bash

# Script d'automatisation pour le moteur ML de MEDS
# Ce script lance la prédiction et la génération de graphiques

# Chemin du dossier IA
IA_DIR="$(cd "$(dirname "$0")" && pwd)"
PREDICTION_DIR="$IA_DIR/prediction"

echo "--------------------------------------------------"
echo "[MEDS AUTO] Lancement de l'analyse ML : $(date)"
echo "--------------------------------------------------"

# 1. Installer/Vérifier les dépendances (optionnel)
# pip install -r "$IA_DIR/requirements.txt" --quiet

# 2. Lancer la détection d'anomalies
echo "[1/2] Analyse des ventes et détection d'épidémies..."
python3 "$PREDICTION_DIR/prediction.py"

if [ $? -eq 0 ]; then
    echo "[SUCCÈS] Alertes générées."
else
    echo "[ERREUR] Échec de l'analyse ML."
    exit 1
fi

# 3. Mettre à jour les graphiques
echo "[2/2] Mise à jour des graphiques de visualisation..."
python3 "$PREDICTION_DIR/visualisation.py"

if [ $? -eq 0 ]; then
    echo "[SUCCÈS] Graphiques mis à jour."
else
    echo "[ERREUR] Échec de la génération des graphiques."
    exit 1
fi

echo "--------------------------------------------------"
echo "[MEDS AUTO] Tâche terminée avec succès."
echo "--------------------------------------------------"
