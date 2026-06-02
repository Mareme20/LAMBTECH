# Documentation technique du module IA/Prédiction

## Objectif

Ce document décrit le module `ia/prediction` de façon exhaustive pour que toute l'équipe comprenne :

- la génération des données simulées,
- la détection d'anomalies épidémiques avec Isolation Forest,
- le couplage entre l'alerte épidémique et le moteur logistique des stocks,
- l'exposition des endpoints FastAPI,
- la structure des données de sortie et l'impact du facteur d'accélération IA sur l'autonomie en heures.

---

## 1. Architecture générale

Le pipeline couvre les étapes suivantes :

1. `data_generator.py` : simulation des ventes historiques de pharmacies.
2. `prediction.py` : détection de pics de consommation par Isolation Forest (fonction `optimiser_et_predire_ml`).
3. `stock_predictive_engine.py` : projection de rupture de stock en fonction du couplage IA.
4. `app.py` : API FastAPI exposant les endpoints épidémie et stock.

### Fichiers principaux

- `ia/prediction/app.py`
- `ia/prediction/data_generator.py`
- `ia/prediction/prediction.py`
- `ia/prediction/stock_predictive_engine.py`
- `ia/prediction/data_stock_generator.py`

---

## 2. Génération des données

### 2.1 `data_generator.py`

Cette fonction simule un historique de ventes sur 90 jours par défaut.

Structure renvoyée :

- `date`
- `pharmacie_id`
- `nom_pharmacie`
- `zone`
- `medicament_id`
- `nom_medicament`
- `ventes`

### 2.2 Logique métier simulée

- 20 pharmacies potentielles sont modélisées, avec des zones de Dakar.
- Plusieurs médicaments sont couverts, dont `Artemether`, `Paracetamol`, `Amoxicilline`, etc.
- Un pic épidémique est simulé pour `Pikine` sur `Artemether` après le jour 75.
- Un effet saisonnier est appliqué sur `Artemether` pour certaines périodes de pluie.

---

## 3. Moteur d’alerte épidémique : Isolation Forest

### 3.1 `prediction.py`

L'algorithme principal est `IsolationForest` de `scikit-learn`.

#### 3.1.1 Prétraitement et features

Les transformations suivantes sont réalisées :

- `date_formatee` : conversion en datetime.
- `jour_semaine` : jour de la semaine.
- `mois`, `mois_sin`, `mois_cos` : représentation cyclique du mois.
- `ventes_veille`, `ventes_avant_veille` : lags de ventes.
- `tendance_7j` : moyenne mobile de 7 jours.
- `volatilite_7j` : écart-type sur 7 jours.

#### 3.1.2 Modèle et entraînement

Paramètres du modèle :

- `IsolationForest(n_estimators=150, contamination='auto', max_samples='auto', random_state=42)`.
- Les données sont standardisées avec `StandardScaler` avant l'entraînement.

#### 3.1.3 Filtrage des anomalies

- Les anomalies sont identifiées par `is_anomaly == -1`.
- Seules les anomalies où `ventes > tendance_7j` sont conservées.
- Filtrage sur les 5 derniers jours pour ne garder que les alertes récentes.

#### 3.1.4 Calcul du score d’alerte

- `score_brut` est converti en un score normalisé `valeur_danger_ml` entre 0 et 100.
- Le score est calculé via `clip_et_normaliser_score()`.

#### 3.2 Format de sortie des alertes épidémiques

Champs renvoyés par `optimiser_et_predire_ml()` (format interne `snake_case`) :

- `pharmacie_id`
- `nom_pharmacie`
- `zone`
- `medicament_id`
- `nom_medicament`
- `type_alerte`
- `niveau_alerte`
- `valeur_danger_ml`
- `date_detection`
- `message`

Ce format est le livrable principal pour la phase d’intégration avec la logistique. L'API peut mapper ces champs en `CamelCase` quand nécessaire.

---

## 4. Moteur logistique et couplage IA/stock

### 4.1 Source des stocks

Fichier : `data_stock_generator.py`

Données générées :

- `pharmacie_id`
- `nom_pharmacie`
- `zone`
- `medicament_id`
- `nom_medicament`
- `stock_physique`
- `seuil_securite_fixe`
- `vitesse_croisiere_j`

Point important :

- `Pikine` + `Artemether` est configuré pour illustrer un cas de rupture avec un stock bas `22` et une vitesse de consommation élevée `12.0`.

### 4.2 Couplage avec l’alerte IA

Fichier : `stock_predictive_engine.py`

Logique :

1. Chargement du stock actuel depuis `stocks_actuels_dakar.csv`.
2. Chargement des alertes IA depuis `alertes_output_production.json`.
3. Recherche par clé `(pharmacie_id, medicament_id)`.
4. Application du facteur d’accélération IA.

#### 4.2.1 Calcul du facteur d’accélération

- `facteur_ia = valeur_danger_ml / 100.0`
- `vitesse_reelle = vitesse_croisiere_j * (1 + facteur_ia)`

Exemple :

- `valeur_danger_ml = 72` → `facteur_ia = 0.72`
- `vitesse_reelle = vitesse_croisiere_j * 1.72`

#### 4.2.2 Calcul de l’autonomie

- `autonomie_jours = stock_physique / vitesse_reelle`
- `autonomie_heures = autonomie_jours * 24`

Cela permet de quantifier l’impact direct de l’alerte sur l’autonomie disponible.

### 4.3 Seuils de criticité

- `autonomie_heures <= 36` → `CRITIQUE`
- `36 < autonomie_heures <= 48` → `ATTENTION`
- `autonomie_heures > 48` → aucune alerte générée dans ce pipeline

### 4.4 Format de sortie du moteur logistique

Champs produits dans `ruptures_predictives_output.json` :

- `pharmacie_id`
- `nom_pharmacie`
- `zone`
- `medicament_id`
- `nom_medicament`
- `stock_actuel`
- `vitesse_ajustee_j`
- `facteur_acceleration_ia`
- `autonomie_restante_h`
- `statut_rupture`
- `recommandation_appro`

---

## 5. Endpoints FastAPI exposés

Fichier : `app.py`

### 5.1 `GET /`

Retourne un simple health-check :

```json
{
  "status": "online",
  "project": "MEDS - Solution IA",
  "version": "1.0.0"
}
```

### 5.2 `GET /api/v1/alerts/epidemic`

Flux :

- `generer_donnees_test()` génère le dataset.
- `optimiser_et_predire_ml(df_historique)` exécute l’Isolation Forest.

Réponse :

- `total_alerts` (nombre total d'alertes générées)
- `alerts` (liste d'alertes au format `snake_case`, identique au format produit par `optimiser_et_predire_ml()`)

### 5.3 `GET /api/v1/alerts/stock`

Flux :

- identique à l’endpoint épidémique pour générer les alertes IA.
- calcul du stock actualisé pour chaque alerte.
- application du facteur IA et calcul de l’autonomie en heures.

Réponse :

- `total_critical_stocks` (nombre d'alertes logistiques critiques détectées)
- `alerts` (liste d'alertes formatées pour le backend consommateur ; dans l'implémentation actuelle les objets de sortie sont fournis en `CamelCase` pour faciliter l'intégration front/backend)

### 5.4 `POST /api/v1/pipeline/run`

Déclenche `executer_pipeline_stocks()` pour régénérer le livrable de rupture :

- `ruptures_predictives_output.json`

---

## 6. Structure de données CamelCase et synchronisation

### 6.1 Format CamelCase et mapping

Le pipeline ML produit des objets en `snake_case`. Pour l'endpoint `/api/v1/alerts/stock`, `app.py` construit des objets en `CamelCase` afin de faciliter l'intégration avec les consommateurs (frontend / backend Node.js). Les clés présentes côté API logistique sont :

- `pharmacieId`
- `nomPharmacie`
- `adresse` (peut être absente dans le flux ML; la valeur par défaut actuelle est `"Non fournie"`)
- `medicamentId`
- `nomCommercial` (rempli par `nom_medicament` si `nomCommercial` n'est pas fourni par le pipeline)
- `molecule` (fallback sur `nom_medicament`)
- `stockActuel`
- `vitesseAjustee`
- `autonomieHeures`
- `statutLogistique`
- `recommandationCommande`

L'implémentation actuelle réalise un mapping robuste (fallbacks) entre `snake_case` et `CamelCase` pour éviter les erreurs liées aux différences de schéma.

### 6.2 Synchronisation des champs métier

Pour que le couplage marche correctement, il faut garantir :

- la correspondance entre les identifiants IA (`pharmacie_id`, `medicament_id`) et les stocks,
- l’utilisation d’un seul champ de danger IA : `valeur_danger_ml`,
- la conversion cohérente de `snake_case` vers `CamelCase` lorsque l’on expose l’API,
- la production d’une `autonomieHeures` explicite en heures.

---

## 7. Impact du facteur d’accélération sur l’autonomie

L’IA ne se contente pas de signaler une anomalie : elle influence directement la durée de stock disponible.

### Formule centrale

```
vitesse_ajustee = vitesse_croisiere_j * (1 + facteur_acceleration)
autonomie_heures = (stock_physique / vitesse_ajustee) * 24
```

### Interprétation

- plus `valeur_danger_ml` est élevé, plus `facteur_acceleration` augmente,
- plus la vitesse d’écoulement augmente,
- plus l’`autonomie_heures` chute.

Par exemple :

- si `stock_physique = 50`, `vitesse_croisiere_j = 6`, `valeur_danger_ml = 50`
- alors `vitesse_ajustee = 9`
- et `autonomie_heures = (50 / 9) * 24 ≈ 133,3 h`

Ce calcul rend l’impact IA visible en heures, ce qui facilite la prise de décision logistique.

---

## 8. Points de vigilance et recommandations

### 8.1 Incohérences relevées (historique et état actuel)

Historique : le pipeline ML produit ses alertes en `snake_case` (par ex. `valeur_danger_ml`). Une version antérieure de `app.py` cherchait certaines clés en `CamelCase` (ex: `valeurDangerMl`) et causait des erreurs d'accès aux données.

État actuel : `app.py` a été corrigé pour lire `snake_case` et effectuer un mapping vers `CamelCase` avec des fallbacks (ex: `nomCommercial` ← `nom_medicament`). Ainsi, l'endpoint `/api/v1/alerts/stock` expose désormais des objets en `CamelCase` tout en acceptant la structure native du pipeline ML.

Il reste important de conserver une convention claire : le pipeline interne produit `snake_case`; l'API publique peut exposer `CamelCase` mais cela doit être documenté et validé par des schémas (Pydantic/JSON Schema).

### 8.2 Recommandations

1. standardiser les objets ML produits en `snake_case` puis les mapper en `CamelCase` pour l’API.
2. ajouter un objet `Pydantic` ou un schéma de validation JSON pour chaque endpoint.
3. aligner les noms des champs entre :
   - `prediction_production.py`,
   - `stock_predictive_engine.py`,
   - `app.py`,
   - et le backend Node.js.
4. ajouter des tests de bout en bout sur :
   - génération des données,
   - détection d’anomalies,
   - calcul de l’autonomie,
   - exposition des schémas.

---

## 9. Recommandation de structure future

Pour rendre le module plus maintenable, l’équipe peut adopter :

- `models.py` pour définir les schémas Pydantic,
- `services/` pour isoler la logique ML et la logique stock,
- `schemas/` pour les mappings CamelCase,
- un test `tests/test_prediction.py` et `tests/test_logistique.py`.

---

## 10. Fichiers de sortie générés

- `alertes_output_production.json` : alertes épidémiques produites par le ML.
- `ruptures_predictives_output.json` : ruptures de stock anticipées par le moteur logistique.
- `stocks_actuels_dakar.csv` : inventaire initial des stocks.

---

## 11. Résumé rapide

- L’Isolation Forest détecte les pics épidémiques.
- Le score `valeur_danger_ml` devient un facteur d’accélération IA.
- Ce facteur ajuste la vitesse de consommation des stocks.
- L’autonomie est exprimée en heures et déclenche des statuts `ATTENTION` / `CRITIQUE`.
- Les endpoints FastAPI exposent ces deux flux : épidémie et stock.
