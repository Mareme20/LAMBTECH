# Algo de prediction de stock couple avec notre modele Isolation Forest pour les rupture de stock sous 48 heures
import pandas as pd
import json
import math
import os

def executer_pipeline_stocks():
    print("\n⚡ [Moteur Prédictif Stocks] Lancement de l'analyse d'autonomie...")
    
    # 1. Chargement des stocks actuels
    if not os.path.exists("stocks_actuels_dakar.csv"):
        from data_stock_generator import initialiser_stocks_officines
        df_stocks = initialiser_stocks_officines()
    else:
        df_stocks = pd.read_csv("stocks_actuels_dakar.csv")
        
    # 2. Chargement des alertes épidémiques ML (Semaine 2)
    alertes_ml = []
    if os.path.exists("alertes_output_production.json"):
        with open("alertes_output_production.json", "r", encoding="utf-8") as f:
            # Gérer le fichier potentiellement tronqué ou complet
            try:
                alertes_ml = json.load(f)
            except json.JSONDecodeError:
                # Fallback de secours si le JSON brut est mal formateur à cause de la coupure
                print("[⚠️ Warning] Fichier JSON tronqué détecté. Nettoyage à la volée...")
                with open("alertes_output_production.json", "r", encoding="utf-8") as f_raw:
                    content = f_raw.read().strip()
                    if not content.endswith("]"):
                        content = content.rsplit("},", 1)[0] + "}]"
                    alertes_ml = json.loads(content)
    
    # Indexer les alertes ML par (pharmacie_id, medicament_id) pour une recherche en O(1)
    dict_alertes_ml = {}
    for alerte in alertes_ml:
        key = (alerte["pharmacie_id"], alerte["medicament_id"])
        # On garde la valeur de danger la plus élevée si doublon
        if key not in dict_alertes_ml or alerte["valeur_danger_ml"] > dict_alertes_ml[key]:
            dict_alertes_ml[key] = alerte["valeur_danger_ml"]

    # 3. Calcul de la projection et couplage IA
    ruptures_anticipees = []
    
    for idx, row in df_stocks.iterrows():
        key = (int(row["pharmacie_id"]), int(row["medicament_id"]))
        
        vitesse_reelle = row["vitesse_croisiere_j"]
        facteur_ia = 0.0
        
        # COUPLAGE : Si l'Isolation Forest a détecté une anomalie, on accélère la consommation
        if key in dict_alertes_ml:
            facteur_ia = dict_alertes_ml[key] / 100.0  # Conversion du pourcentage (ex: 72% -> 0.72)
            vitesse_reelle = row["vitesse_croisiere_j"] * (1 + facteur_ia)
            
        # Calcul de l'autonomie en heures
        autonomie_jours = row["stock_physique"] / vitesse_reelle
        autonomie_heures = autonomie_jours * 24
        
        # Déclenchement de l'alerte logistique prédictive si rupture sous 48h
        if autonomie_heures <= 48:
            niveau_logistique = "CRITIQUE" if autonomie_heures <= 36 else "ATTENTION"
            
            ruptures_anticipees.append({
                "pharmacieId": int(row["pharmacie_id"]),
                "nomPharmacie": row["nom_pharmacie"],
                "zone": row["zone"],
                "medicamentId": int(row["medicament_id"]),
                "nomMedicament": row["nom_medicament"],
                "stockActuel": int(row["stock_physique"]),
                "vitesseAjusteeJ": round(vitesse_reelle, 2),
                "facteurAccelerationIa": round(facteur_ia * 100, 1),
                "autonomieRestanteH": round(autonomie_heures, 1),
                "statutRupture": niveau_logistique,
                "recommandationAppro": f"Commander d'urgence au moins {math.ceil(vitesse_reelle * 7)} boîtes pour couvrir 7 jours."
            })

    # 4. Sauvegarde du livrable de la Semaine 3 pour Marieme et Mamadou
    with open("ruptures_predictives_output.json", "w", encoding="utf-8") as f_out:
        json.dump(ruptures_anticipees, f_out, indent=4, ensure_ascii=False)
        
    print(f"[Succès] Analyse terminée. {len(ruptures_anticipees)} alertes de rupture à 48h détectées.")
    print("📋 Fichier généré avec succès : 'ruptures_predictives_output.json'")

if __name__ == '__main__':
    executer_pipeline_stocks()