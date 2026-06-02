from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import os

# Importation directe de ta fonction de prédiction ML optimisée et du générateur
try:
    from prediction import optimiser_et_predire_ml
    from data_generator import generer_donnees_test
except ImportError:
    print("[ATTENTION] Impossible d'importer le modèle ML ou le générateur de données.")

# Initialisation de l'application FastAPI
app = FastAPI(
    title="MEDS Core IA API",
    description="Moteur prédictif de surveillance épidémique et de gestion des stocks (Dakar)",
    version="1.0.0"
)

# Configuration du CORS pour que Mamadou puisse requêter l'API depuis son app Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Parfait pour Ngrok et le dev local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route 1 : Statut du serveur (Health Check)
@app.get("/", tags=["Système"])
def health_check():
    return {"status": "online", "project": "MEDS - Solution IA", "version": "1.0.0"}

# --- Route 2 : Endpoint pour les alertes Épidémiques (Uniquement l'IA Isolation Forest) ---
@app.get("/api/v1/alerts/epidemic", tags=["Epidémiologie"])
def obtenir_alertes_epidemiques():
    """
    Exécute l'Isolation Forest à la volée sur les données actuelles
    et renvoie uniquement les anomalies sanitaires formatées pour Marieme.
    """
    try:
        # 1. On récupère le flux de données
        df_historique = generer_donnees_test()
        
        # 2. On fait tourner l'Isolation Forest (qui utilise lat/long et renvoie l'adresse en CamelCase)
        alertes_ia = optimiser_et_predire_ml(df_historique)
        
        return {
            "total_alerts": len(alertes_ia), 
            "alerts": alertes_ia
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur modèle épidémique : {str(e)}")

# --- Route 3 : Endpoint pour les alertes Logistiques (Le couplage avec les Stocks) ---
@app.get("/api/v1/alerts/stock", tags=["Logistique"])
def obtenir_alertes_stock():
    """
    Prend les anomalies de l'Isolation Forest et calcule l'impact direct
    sur l'autonomie des stocks physiques (Entité Stock de Marieme).
    """
    try:
        # 1. On récupère le flux de données
        df_historique = generer_donnees_test()
        
        # 2. On récupère les anomalies de l'IA
        alertes_ia = optimiser_et_predire_ml(df_historique)
        
        # 3. On applique les règles logistiques de réapprovisionnement couplées
        alertes_logistiques = []
        for alerte in alertes_ia:
            # Simulation de la lecture du stock physique (Entité Stock de Marieme)
            stock_actuel = 45  # Reçu depuis la BDD en production
            vitesse_normale = 4.2
            
            # Application du couplage (Accélération des ventes calculée par l'IA)
            facteur_acceleration = alerte['valeur_danger_ml']
            vitesse_ajustee = vitesse_normale * (1 + (facteur_acceleration / 100))
            
            # Calcul de l'autonomie critique
            autonomie_h = round((stock_actuel / vitesse_ajustee) * 24, 1)
            
            # Détermination du statut logistique
            niveau_alerte = alerte.get('niveau_alerte', alerte.get('niveauAlerte'))
            if autonomie_h <= 36 or niveau_alerte == "CRITIQUE":
                statut_logistique = "CRITIQUE"
            elif autonomie_h <= 72:
                statut_logistique = "ATTENTION"
            else:
                statut_logistique = "OPTIMAL"

            # Construction de l'objet de sortie synchronisé avec le backend Node.js
            alertes_logistiques.append({
                'pharmacieId': alerte.get('pharmacieId', alerte.get('pharmacie_id')),
                'nomPharmacie': alerte.get('nomPharmacie', alerte.get('nom_pharmacie')),
                'adresse': alerte.get('adresse', "Non fournie"),
                'medicamentId': alerte.get('medicamentId', alerte.get('medicament_id')),
                'nomCommercial': alerte.get('nomCommercial', alerte.get('nom_medicament')),
                'molecule': alerte.get('molecule', alerte.get('nom_medicament')),
                'stockActuel': stock_actuel,
                'vitesseAjustee': round(vitesse_ajustee, 2),
                'autonomieHeures': autonomie_h,
                'statutLogistique': statut_logistique,
                'recommandationCommande': f"Commander d'urgence au moins {int(vitesse_ajustee * 7)} unités pour couvrir 7 jours." if statut_logistique == "CRITIQUE" else "Aucune action requise."
            })
            
        return {
            "total_critical_stocks": len(alertes_logistiques), 
            "alerts": alertes_logistiques
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur moteur logistique : {str(e)}")

# Route 4 : Optionnelle pour forcer un script externe si besoin
@app.post("/api/v1/pipeline/run", tags=["Administration"])
def executer_les_pipelines():
    print("[API] Déclenchement manuel du recalcul des pipelines IA...")
    try:
        from stock_predictive_engine import executer_pipeline_stocks
        executer_pipeline_stocks()
        return {"status": "success", "message": "Pipeline de couplage IA-Stocks exécuté avec succès."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Échec de l'exécution du pipeline : {str(e)}")