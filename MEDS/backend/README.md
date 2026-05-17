# LambTech / MEDS

## Aperçu
MEDS est une API backend (Node.js/Express + TypeScript) pour :
- rechercher des médicaments “nearby” via géolocalisation (PostGIS),
- créer des commandes et initier des paiements Wave,
- assigner automatiquement un livreur après paiement,
- publier l’état en temps réel via Socket.IO,
- exposer des statistiques basées sur les logs.

## Prérequis
- Node.js (version compatible avec le projet)
- PostgreSQL + PostGIS
- Variables d’environnement (fichier `.env`)

## Configuration
Copier/adapter le fichier `.env` (voir `MEDS/backend/.env` si présent dans ton environnement) et configurer :
- `DATABASE_URL` ou les variables DB_* attendues par TypeORM
- `JWT_SECRET`
- `WAVE_API_KEY` (optionnel : sinon Wave fonctionne en mode mock)

## Démarrer
Dans `MEDS/backend` :

```bash
npm install
npm run dev
```

## Tests
```bash
npm test
```

## Contribution / Workflow Git

Quand un collaborateur veut contribuer :

### 1) Cloner le repo
Depuis le dossier où tu mets les projets :

```bash
git clone <URL_DU_REPO>
cd MEDS/backend
```

### 2) Créer une branche
Ne travaille **jamais** directement sur `main`.

Choisis un nom clair :

- fonctionnalité : `feature/<nom>`
- correction : `fix/<nom>`


```bash
git checkout main
git pull origin main
git checkout -b feature/<nom>
```

### 3) Mettre en place l’environnement
```bash
npm install
```

Copie/adapter le fichier `.env` (voir `MEDS/backend/.env` si présent localement) et vérifie :
- `DATABASE_URL` ou les `DB_*`
- `JWT_SECRET`
- `WAVE_API_KEY` (optionnel)

### 4) Implémenter tes fonctionnalités
- Fais tes changements
- Vérifie rapidement avec le dev server (si utilisé) :

```bash
npm run dev
```

### 5) Exécuter les tests avant de pousser
```bash
npm test
```

*(Si un build/lint existe dans le projet, ajoute aussi ces étapes localement.)*

### 6) Pousser ta branche
```bash
git add .
git commit -m "feat(<nom>): description"
git push -u origin feature/<nom>
```

### 7) Ouvrir une Pull Request (PR) vers `main`
- Base de la PR : `main`
- Branche de la PR : `feature/<nom>`

Titre/description :
- ce que tu changes
- comment tu as testé
- endpoints/impacts si applicable

### 8) Merge sur `main`
Le merge doit suivre cette logique :
1. **Relecture** (review) par au moins 1 personne
2. **Résolution des conflits** si la PR ne merge pas proprement
   - soit via “Resolve conflicts” dans l’interface GitHub
   - soit en mettant à jour localement puis en push sur la branche PR
3. Une fois validée : merge sur `main` via la PR.

> Note : le workflow exact (merge commit / squash / rebase) dépend des règles de l’équipe. Par défaut : laisser le comportement standard configuré côté plateforme, mais toujours partir d’une PR vers `main`.

## Git
Ce repo inclut des fichiers `.gitignore` (racine + `MEDS/backend/`) pour exclure notamment :
- `node_modules/`
- `dist/`
- `logs/`
- fichiers `.env`
- `uploads/`


