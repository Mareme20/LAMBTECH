import pandas as pd # type: ignore
import numpy as np # type: ignore
import json
from sklearn.ensemble import IsolationForest # type: ignore
from sklearn.preprocessing import StandardScaler # type: ignore
from data_generator import generer_donnees_test

def optimiser_et_predire_ml(df):
    df_prod = df.sort_values(['pharmacie_id', 'medicament_id', 'date']).copy()
    
    # --- 1. FEATURE ENGINEERING AVANCÉ & CYCLIQUE ---
    df_prod['date_formatee'] = pd.to_datetime(df_prod['date'])
    df_prod['jour_semaine'] = df_prod['date_formatee'].dt.dayofweek
    df_prod['mois'] = df_prod['date_formatee'].dt.month
    
    # Transformation cyclique pour le mois (le ML comprend que Décembre (12) est proche de Janvier (1))
    df_prod['mois_sin'] = np.sin(2 * np.pi * df_prod['mois'] / 12)
    df_prod['mois_cos'] = np.cos(2 * np.pi * df_prod['mois'] / 12)
    
    # Création des Lags et de la Tendance Contextuelle
    df_prod['ventes_veille'] = df_prod.groupby(['pharmacie_id', 'medicament_id'])['ventes'].shift(1)
    df_prod['ventes_avant_veille'] = df_prod.groupby(['pharmacie_id', 'medicament_id'])['ventes'].shift(2)
    df_prod['tendance_7j'] = df_prod.groupby(['pharmacie_id', 'medicament_id'])['ventes'].shift(1).rolling(window=7, min_periods=3).mean()
    df_prod['volatilite_7j'] = df_prod.groupby(['pharmacie_id', 'medicament_id'])['ventes'].shift(1).rolling(window=7, min_periods=3).std()
    
    # Nettoyage des valeurs manquantes et des divisions par zéro potentielles
    df_prod['volatilite_7j'] = df_prod['volatilite_7j'].fillna(1.0).replace(0, 1.0)
    df_prod = df_prod.dropna().copy()
    
    # --- 2. SÉLECTION ET PIPELINE DE SCALING ---
    features = ['ventes', 'ventes_veille', 'ventes_avant_veille', 'tendance_7j', 'volatilite_7j', 'jour_semaine', 'mois_sin', 'mois_cos']
    X = df_prod[features]
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # --- 3. ENTRAÎNEMENT DE L'ISOLATION FOREST OPTIMISÉ ---
    # n_estimators augmenté pour la stabilité, contamination='auto' pour éviter les faux positifs durs
    model = IsolationForest(n_estimators=150, contamination='auto', max_samples='auto', random_state=42)
    
    # fit_predict donne 1 (normal) ou -1 (anomalie)
    df_prod['is_anomaly'] = model.fit_predict(X_scaled)
    # score_samples donne une valeur continue (plus elle est basse/négative, plus c'est une anomalie lourde)
    df_prod['score_brut'] = model.score_samples(X_scaled)
    
    # --- 4. FILTRAGE ET CALCUL DE SÉVÉRITÉ (SEUIL DE SÉCURITÉ CONCOURS) ---
    # On ne garde que les anomalies strictes (-1) et on trie les pires cas
    df_anomalies = df_prod[(df_prod['is_anomaly'] == -1) & (df_prod['ventes'] > df_prod['tendance_7j'])].copy()
    
    alertes_production = []
    
    # Analyse exclusive de la fenêtre temps réel (5 derniers jours)
    dernier_jour = df_prod['date_formatee'].max()
    limite_temps_reel = dernier_jour - pd.Timedelta(days=5)
    anomalies_recentes = df_anomalies[df_anomalies['date_formatee'] >= limite_temps_reel]
    
    for _, row in anomalies_recentes.iterrows():
        # Calcul de l'écart à la norme locale pour le rapport métier
        hausse_pourcent = round(((row['ventes'] - row['tendance_7j']) / row['tendance_7j']) * 100, 1)
        
        # Normalisation du score d'anomalie pour le Frontend (0 à 100 pour la jauge graphique)
        # score_samples de scikit-learn varie généralement entre -0.4 (très anormal) et -0.8 (extrême)
        score_danger = clip_et_normaliser_score(row['score_brut'])
        
        # Détermination dynamique du niveau d'alerte pour le backend
        niveau_alerte = "CRITIQUE" if score_danger >= 70 else "ATTENTION"
        
        alertes_production.append({
            'pharmacie_id': int(row['pharmacie_id']),
            'nom_pharmacie': row['nom_pharmacie'],
            'zone': row['zone'],
            'medicament_id': int(row['medicament_id']),
            'nom_medicament': row['nom_medicament'],
            'type_alerte': 'EPIDEMIE_ML_PROD',
            'niveau_alerte': niveau_alerte,
            'valeur_danger_ml': score_danger, # Une jauge de 0 à 100 hyper exploitable par Mamadou
            'date_detection': str(row['date']),
            'message': f"[Production ML] Alerte {niveau_alerte} à {row['nom_pharmacie']} ({row['zone']}). Les ventes d'échantillons de {row['nom_medicament']} affichent une déviation de +{hausse_pourcent}% par rapport au comportement habituel de la zone (Indice de certitude algorithmique : {score_danger}%)."
        })
        
    return alertes_production

def clip_et_normaliser_score(score_brut):
    # Transformation mathématique pour passer d'un score brut négatif sklearn à un pourcentage d'anomalie propre
    # Plus score_brut est bas (ex: -0.75), plus le danger est proche de 100%
    brut_min, brut_max = -0.85, -0.45
    score_clippe = np.clip(score_brut, brut_min, brut_max)
    pourcentage = ((brut_max - score_clippe) / (brut_max - brut_min)) * 100
    return round(pourcentage, 1)

if __name__ == '__main__':
    print("[MEDS CORE PROD] Initialisation du pipeline de données...")
    df_historique = generer_donnees_test()
    
    print("[MEDS CORE PROD] Exécution de la forêt d'isolement multicouche standardisée...")
    alertes_finales = optimiser_et_predire_ml(df_historique)
    
    print(f"\n[Moteur ML] Analyse terminée. Nombre d'alertes temps réel validées : {len(alertes_finales)}")
    for alerte in alertes_finales:
        print(f"--> [{alerte['niveau_alerte']} - Confiance: {alerte['valeur_danger_ml']}%] {alerte['zone']} : {alerte['nom_medicament']}")
        print(f"    Message envoyé au serveur : {alerte['message']}\n")
        
    # EXPORT SÉCURISÉ POUR LE BACKEND NODE.JS
    with open('alertes_output_production.json', 'w', encoding='utf-8') as f:
        json.dump(alertes_finales, f, ensure_ascii=False, indent=4)
    print("[Succès Integration] Le fichier 'alertes_output_production.json' a été généré pour le serveur.")