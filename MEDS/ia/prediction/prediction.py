
import pandas as pd # type: ignore

import numpy as np # type: ignore

import json
import os
from sqlalchemy import create_engine # type: ignore
from dotenv import load_dotenv # type: ignore
from sklearn.ensemble import IsolationForest # type: ignore
from sklearn.preprocessing import StandardScaler # type: ignore

# Chargement des variables d'environnement depuis le backend
load_dotenv(os.path.join(os.path.dirname(__file__), '../../backend/.env'))

def fetch_data_from_db():
    try:
        db_host = os.getenv('DB_HOST', 'localhost')
        db_port = os.getenv('DB_PORT', '5432')
        db_user = os.getenv('DB_USERNAME', 'medsuser')
        db_pass = os.getenv('DB_PASSWORD', 'medspassword')
        db_name = os.getenv('DB_NAME', 'meds_db')
        
        db_url = f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
        engine = create_engine(db_url)
        
        query = """
        SELECT 
            c."dateCommande"::date as date,
            p.id as pharmacie_id,
            p.nom as nom_pharmacie,
            p.zone,
            m.id as medicament_id,
            m."nomCommercial" as nom_medicament,
            SUM(ci.quantite) as ventes
        FROM commandes c
        JOIN pharmacies p ON c."pharmacieId" = p.id
        JOIN commande_items ci ON ci."commandeId" = c.id
        JOIN medicaments m ON ci."medicamentId" = m.id
        GROUP BY date, pharmacie_id, nom_pharmacie, p.zone, medicament_id, nom_medicament
        ORDER BY date ASC;
        """
        
        df = pd.read_sql(query, engine)
        if df.empty:
            print("[ATTENTION] La base de données est vide. Utilisation de données simulées pour le test.")
            from data_generator import generer_donnees_test
            return generer_donnees_test()
        return df
    except Exception as e:
        print(f"[ERREUR DB] Impossible de se connecter à la base : {e}")
        from data_generator import generer_donnees_test
        return generer_donnees_test()

def optimiser_et_predire_ml(df):
    if df.empty: return []
    
    df_prod = df.sort_values(['pharmacie_id', 'medicament_id', 'date']).copy()
    
    # --- 1. FEATURE ENGINEERING AVANCÉ & CYCLIQUE ---
    df_prod['date_formatee'] = pd.to_datetime(df_prod['date'])
    df_prod['jour_semaine'] = df_prod['date_formatee'].dt.dayofweek
    df_prod['mois'] = df_prod['date_formatee'].dt.month
    
    # Transformation cyclique pour le mois
    df_prod['mois_sin'] = np.sin(2 * np.pi * df_prod['mois'] / 12)
    df_prod['mois_cos'] = np.cos(2 * np.pi * df_prod['mois'] / 12)
    
    # Création des Lags et de la Tendance Contextuelle
    df_prod['ventes_veille'] = df_prod.groupby(['pharmacie_id', 'medicament_id'])['ventes'].shift(1)
    df_prod['ventes_avant_veille'] = df_prod.groupby(['pharmacie_id', 'medicament_id'])['ventes'].shift(2)
    df_prod['tendance_7j'] = df_prod.groupby(['pharmacie_id', 'medicament_id'])['ventes'].shift(1).rolling(window=7, min_periods=3).mean()
    df_prod['volatilite_7j'] = df_prod.groupby(['pharmacie_id', 'medicament_id'])['ventes'].shift(1).rolling(window=7, min_periods=3).std()
    
    # Nettoyage des valeurs manquantes
    df_prod['volatilite_7j'] = df_prod['volatilite_7j'].fillna(1.0).replace(0, 1.0)
    df_prod = df_prod.dropna().copy()
    
    if df_prod.empty:
        print("[INFO] Pas assez de données historiques (lags) pour l'analyse.")
        return []

    # --- 2. SÉLECTION ET PIPELINE DE SCALING ---
    features = ['ventes', 'ventes_veille', 'ventes_avant_veille', 'tendance_7j', 'volatilite_7j', 'jour_semaine', 'mois_sin', 'mois_cos']
    X = df_prod[features]
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # --- 3. ENTRAÎNEMENT DE L'ISOLATION FOREST OPTIMISÉ ---
    model = IsolationForest(n_estimators=150, contamination='auto', max_samples='auto', random_state=42)
    
    df_prod['is_anomaly'] = model.fit_predict(X_scaled)
    df_prod['score_brut'] = model.score_samples(X_scaled)
    
    # --- 4. FILTRAGE ET CALCUL DE SÉVÉRITÉ ---
    df_anomalies = df_prod[(df_prod['is_anomaly'] == -1) & (df_prod['ventes'] > df_prod['tendance_7j'])].copy()
    
    alertes_production = []
    
    # Analyse exclusive de la fenêtre temps réel (5 derniers jours de données dispos)
    dernier_jour = df_prod['date_formatee'].max()
    limite_temps_reel = dernier_jour - pd.Timedelta(days=5)
    anomalies_recentes = df_anomalies[df_anomalies['date_formatee'] >= limite_temps_reel]
    
    for _, row in anomalies_recentes.iterrows():
        hausse_pourcent = round(((row['ventes'] - row['tendance_7j']) / row['tendance_7j']) * 100, 1)
        score_danger = clip_et_normaliser_score(row['score_brut'])
        niveau_alerte = "CRITIQUE" if score_danger >= 70 else "ATTENTION"
        
        alertes_production.append({
            'pharmacie_id': int(row['pharmacie_id']),
            'nom_pharmacie': row['nom_pharmacie'],
            'zone': row['zone'] if row['zone'] else "Zone Inconnue",
            'medicament_id': int(row['medicament_id']),
            'nom_medicament': row['nom_medicament'],
            'type_alerte': 'EPIDEMIE_ML_PROD',
            'niveau_alerte': niveau_alerte,
            'valeur_danger_ml': score_danger,
            'date_detection': str(row['date']),
            'message': f"[Alerte {niveau_alerte}] À {row['nom_pharmacie']} ({row['zone']}). Les ventes de {row['nom_medicament']} ont augmenté de +{hausse_pourcent}% (Indice de danger : {score_danger}%)."
        })
        
    return alertes_production

def clip_et_normaliser_score(score_brut):
    brut_min, brut_max = -0.85, -0.45
    score_clippe = np.clip(score_brut, brut_min, brut_max)
    pourcentage = ((brut_max - score_clippe) / (brut_max - brut_min)) * 100
    return round(pourcentage, 1)

if __name__ == '__main__':
    print("[MEDS IA] Récupération des données depuis la base de données...")
    df_historique = fetch_data_from_db()
    
    print(f"[MEDS IA] Analyse de {len(df_historique)} lignes de transactions...")
    alertes_finales = optimiser_et_predire_ml(df_historique)
    
    print(f"\n[Moteur ML] Analyse terminée. Nombre d'alertes détectées : {len(alertes_finales)}")
    for alerte in alertes_finales:
        print(f"--> [{alerte['niveau_alerte']}] {alerte['nom_pharmacie']} : {alerte['nom_medicament']} ({alerte['valeur_danger_ml']}%)")
        
    # EXPORT POUR LE BACKEND
    output_path = os.path.join(os.path.dirname(__file__), 'alertes_output_production.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(alertes_finales, f, ensure_ascii=False, indent=4)
    print(f"[Succès] Résultats exportés dans {output_path}")