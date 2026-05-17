# Cahier de charge — MEDS (LambTech)

## 1. Contexte
MEDS est une application backend (API) permettant :
- de gérer des **médicaments** et leur **disponibilité** par pharmacie ;
- de créer des **commandes** et d’effectuer le paiement via **Wave** ;
- d’assigner automatiquement une **livraison** (livreur) dès qu’une commande est payée ;
- de fournir des **statistiques** à partir de l’historique de recherches ;
- de proposer une fonctionnalité **IA** autour de la lecture OCR des ordonnances et d’un chatbot.

L’implémentation actuelle repose sur :
- **Node.js / Express** (API HTTP)
- **TypeScript**
- **TypeORM** avec **PostgreSQL + PostGIS**
- **Socket.IO** pour la diffusion temps réel des mises à jour
- **JWT** pour l’authentification

---

## 2. Objectifs
1. Permettre la recherche de médicaments **à proximité** (géolocalisation).
2. Mettre à disposition des capacités transactionnelles :
   - création commande,
   - initialisation du paiement,
   - mise à jour du statut après webhook.
3. Réduire le temps d’exécution perçu grâce à l’assignation automatique du livreur et aux notifications temps réel.
4. Offrir un reporting via statistiques d’épidémiologie (basé sur les recherches).
5. Compléter l’expérience utilisateur par une couche IA (OCR + conversation).

---

## 3. Périmètre fonctionnel (modules)
Le périmètre couvre les modules suivants (présents dans le code et/ou décrits dans l’UML) :

- **Auth**
  - inscription / connexion
  - délivrance d’un JWT
  - contrôle d’accès par rôles

- **Médicaments**
  - création / liste
  - recherche “nearby” par zone et rayon

- **Pharmacies**
  - gestion (routes et entités présentes côté repo)

- **Stock**
  - création de stocks
  - mise à jour de quantités
  - recherche de disponibilité (protégée par rôles)

- **Commandes**
  - création commande
  - génération session paiement Wave
  - mise à jour statut
  - assignation livreur dès paiement
  - notifications Socket.IO

- **Paiements**
  - webhook Wave pour validation et mise à jour du statut

- **Géolocalisation / Livraison**
  - calcul du livreur le plus proche (distance géospatiale)

- **Stats**
  - statistiques d’épidémiologie via agrégation SQL sur les logs

- **IA / OCR / Chatbot**
  - lecture OCR d’ordonnance (actuellement mock dans le contrôleur)
  - conversation assistée (service chatbot)

---

## 4. Utilisateurs & rôles
Les rôles implémentés (enum) :
- **PATIENT**
- **PHARMACIE**
- **LIVREUR**
- **ADMIN**
- **DISTRICT**

Les middlewares de sécurité appliquent les autorisations au niveau des routes (ex. `roleMiddleware([...])`).

---

## 5. Cas d’usage (extraits UML)
Référence : `uml/usecase.puml`.

- **Inscription / Login**
- **Recherche de médicaments à proximité**
- **Créer une commande**
- **Voir ses commandes**
- **Mettre à jour une commande (par pharmacien)**
- **Voir statistiques d’épidémiologie**
- **Scanner ordonnance (OCR)**
- **Chatbot**
- **Paiement commande (Wave)**
- **Suivi de livraison (tracking)**

---

## 6. Exigences fonctionnelles détaillées

### 6.1 Auth
- **Register**
  - Entrée : `email`, `motDePasse`, infos utilisateur.
  - Traitement : hachage bcrypt, création en base.
  - Sortie : persistance utilisateur.

- **Login**
  - Entrée : `email`, `motDePasse`.
  - Traitement : comparaison bcrypt, génération JWT.
  - Sortie : `{ token, utilisateur }`.

- **Sécurité**
  - JWT signé via `process.env.JWT_SECRET`.
  - Durée de vie : `7d`.

---

### 6.2 Medicaments — recherche “nearby”
Référence : `uml/sequence-search.puml`.

**Endpoint**
- `GET /api/medicaments/nearby?lat=...&lon=...&medicamentId=...&rayon=...`

**Règles**
- `lat`, `lon`, `medicamentId` obligatoires.
- `rayon` optionnel, valeur par défaut : **10**.

**Traitement**
- Le controller valide la présence des paramètres.
- Le service délègue au repository une requête géospatiale (PostGIS) pour renvoyer les résultats à l’intérieur du rayon.

**Sortie**
- JSON contenant la liste des pharmacies/disponibilités selon la couche repository.

---

### 6.3 Stock
**Endpoints (protégés par rôles ADMIN/PHARMACIE)**
- `POST /api/stocks` : création stock
- `PUT /api/stocks/:pharmacieId/:medicamentId` : update quantité
- `GET /api/stocks` : liste
- `GET /api/stocks/search?nom=...&latitude=...&longitude=...` : recherche disponibilité (fonctionnelle)

**Règles**
- Mise à jour de quantités selon `pharmacieId` et `medicamentId`.
- La recherche disponibilité prend en compte la localisation.

---

### 6.4 Commandes & paiement Wave
Référence : `uml/sequence-order.puml`.

#### 6.4.1 Création commande
**Endpoint**
- `POST /api/commandes/` (route présente, contrôleur existant)

**Flux**
1. `CommandeController.create()` appelle `CommandeService.create(dto)`
2. Le service crée la commande via `CommandeRepository`
3. Le service génère une session paiement via `WaveService.createPaymentSession(montant, commandeId)`
4. Socket.IO émet `nouvelle_commande`

**Sortie**
- JSON incluant le champ `payment_url` retourné par WaveService.

#### 6.4.2 Mise à jour statut commande
**Endpoint**
- `PUT /api/commandes/:id/status` (route décrite par l’UML + DTO `UpdateStatusDto`)

**Flux**
1. Update statut via repository : `updateStatus(id, statut)`
2. Diffusion Socket.IO : `commande_statut`
3. Si le statut devient **PAYEE** :
   - récupération commande
   - récupération pharmacie de la commande
   - recherche du livreur le plus proche (ST_Distance)
   - émission `course_assignee` si un livreur est trouvé

---

### 6.5 Paiements — webhook Wave
**Endpoint**
- `POST /api/payments/wave/webhook`

**Règles**
- Validation signature via le `WaveService.verifyWebhook(payload, signature)`.
- Extraction `order_id` du payload.

**Traitement**
- Si `order_id` présent :
  - update statut commande en “payée”.

**Sortie**
- `200 { received: true }` ou `401 { message: "Signature invalide" }`.

> Remarque d’implémentation : WaveService est actuellement en mode mock si la variable `WAVE_API_KEY` n’est pas configurée.

---

### 6.6 Géolocalisation — assignation livreur
**Composant**
- `DeliveryService.findNearestLivreur(pharmacyLat, pharmacyLon)`

**Traitement**
- Requête SQL PostGIS : calcul distance et choix du minimum.
- Filtre sur les utilisateurs ayant le rôle **LIVREUR**.

**Sortie**
- objet livreur le plus proche, ou `null`.

---

### 6.7 Stats — épidémiologie
**Endpoint**
- `GET /api/stats/epidemiology`

**Traitement**
- agrégation SQL sur `search_logs` :
  - nombre total de recherches par `medicamentNom`
  - moyennes de `latitude` et `longitude`

**Sortie**
- JSON liste de résultats triés par `total_recherches desc`.

---

### 6.8 IA — OCR et chatbot
**Endpoints**
- Routes définies côté `ai.routes.ts` (controller `AIController`).

**Fonctions**
- OCR : `scanPrescription(req, res)`
  - actuellement : analyse mock (le buffer est vide dans l’implémentation actuelle)
  - **flux cible (à venir) :**
    1) le patient upload une image de l’ordonnance (ex. interface front)
    2) backend traite le fichier via **multer** (upload image)
    3) OCR extrait le texte (noms de médicaments, dosages, etc.)
    4) le système **génère une liste de médicaments identifiés** (ex. normalisation + correspondance avec les médicaments existants)
    5) optionnel : pré-remplissage de la **commande** et/ou déclenchement d’une recherche **nearby** basée sur les médicaments détectés
- Chat : `chat(req, res)`
  - utilise `ChatbotService.getResponse(message, lang)`


**Sortie**
- OCR : `{ medicaments: results }`
- Chat : `{ response }`

> Exigence implicite : intégration réelle OCR (upload image, multer, appel à un modèle) à finaliser.

---

## 7. Exigences non fonctionnelles

### 7.1 Sécurité
- **JWT** pour auth.
- **Contrôle de rôles** via middleware.
- **Webhooks** : validation signature Wave (à rendre “réel” si WAVE_API_KEY fourni).

### 7.2 Données & persistance
- Postgres + PostGIS.
- Entités TypeORM mappées sur `src/modules/**/entity/*`.

### 7.3 Performance
- Requêtes géospatiales doivent utiliser PostGIS (ex. `ST_Distance`, `ST_DWithin`), avec index GIST/GIN si applicable.
- Limiter les résultats (ex. `LIMIT 1` pour livreur, rayon paramétrable pour recherche).

### 7.4 Observabilité
- Logger via `morgan("dev")`.
- Émissions Socket.IO pour traçabilité des événements de commande.

---

## 8. Modèle de données (niveau haut)
Les entités sont réparties par module. L’UML “domain” (`uml/class-domain.puml`) décrit les entités et leurs relations.

À minima, le repo contient :
- `User` (auth)
- `Medicament` (médicaments)
- `Pharmacie` (pharmacies)
- `Stock` (stocks)
- `Commande` (commandes + statuts)
- `LivreurPosition` (positions géospatiales livreurs)
- `SearchLog` (logs de recherche)

---

## 9. Intégrations externes

### 9.1 Wave
- Création session checkout (actuellement mock si clé absente)
- Webhook de confirmation de paiement

### 9.2 IA/OCR
- OCRService (implémentation actuelle à préciser : mock vs modèle réel)
- ChatbotService (à préciser côté fournisseur/model)

---

## 10. Hypothèses & risques
- **Wave** : si non configuré, les paiements sont simulés.
- **OCR** : intégration réelle non finalisée (actuellement non branchée à un upload réel).
- **Cohérence statut** : dépend de la réception webhook et des mises à jour côté repository.
- **Recherche géographique** : nécessite bonnes pratiques PostGIS (indexation) pour passer à l’échelle.

---

## 11. Livrables
1. API HTTP conforme aux routes décrites.
2. Notifications temps réel via Socket.IO.
3. Documentation d’intégration (Wave, OCR/Chatbot).
4. UML PlantUML maintenue (déjà existante dans `uml/`).

---

## 12. Critères d’acceptation (exemples)
- Un utilisateur PATIENT peut créer une commande et obtenir une `payment_url`.
- Après webhook Wave “PAYEE”, la commande passe au statut “payée” et `course_assignee` est émis si un livreur existe.
- La route de recherche `medicaments/nearby` renvoie des résultats pour un couple (lat, lon) et un `rayon`.
- La route statistiques renvoie un classement basé sur les `search_logs`.
- Les routes protégées (ex. stock) refusent les accès non autorisés.

---

## 13. Références UML
- `uml/usecase.puml`
- `uml/sequence-order.puml`
- `uml/sequence-search.puml`
- `uml/class-*.puml` (entités/services/repos)

