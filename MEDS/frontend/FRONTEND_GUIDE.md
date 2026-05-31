# 🚀 Guide d'Intégration Frontend (MEDS)

Ce document est destiné à l'équipe **Backend**. Il explique l'architecture du Frontend que nous avons mise en place et comment vous pouvez facilement y connecter l'API Node.js/Postgres.

## 🏗️ Architecture Globale

Le Frontend est codé en **React (Vite)** avec **TailwindCSS (v3.4)**.
Il a été conçu selon une approche **"Mobile-First" (PWA)** pour garantir une expérience similaire à une application native sur les smartphones.

### Structure des dossiers clés :
- `src/pages/` : Contient toutes les vues principales (Dashboards, Accueil, Login, Scan).
- `src/layouts/` : Les Layouts qui englobent les pages.
  - `MainLayout.tsx` : Pour les pages publiques (Accueil, Contact) avec la barre de navigation et le Footer.
  - `DashboardLayout.tsx` : Contient la **Sidebar (PC)** et la **Bottom Navigation Bar (Mobile)** pour les espaces connectés.
- `src/index.css` : Contient les règles CSS personnalisées, notamment les sécurités Mobile-First (anti-rebond, anti-sélection) et le design "Glassmorphism".

## 🔌 Comment connecter le Backend ?

Actuellement, les données affichées dans les pages (comme les statistiques, l'inventaire des pharmacies, ou l'historique des livreurs) sont des données fictives ("mock data") codées en dur dans les composants.

### Étape 1 : Mettre en place Axios
Créez un dossier `src/api` ou `src/services` pour configurer `axios` pointant vers votre serveur backend (ex: `http://localhost:5000/api`).

### Étape 2 : L'Authentification
Le point d'entrée de l'application est `src/pages/Login.tsx`. 
- Vous y trouverez le formulaire de connexion.
- Vous devrez intercepter le "submit", envoyer les requêtes à votre route de login, puis stocker le token (ex: JWT) dans le `localStorage` ou dans un contexte global (Context API / Zustand / Redux).

### Étape 3 : Remplacer les Mocks par vos Données
Dans chaque Dashboard (`AdminDashboard.tsx`, `PatientDashboard.tsx`, etc.), repérez les tableaux de données au début du composant (ex: `const orders = [...]`).
- Supprimez ces tableaux.
- Utilisez un `useEffect` (ou React Query / SWR) pour aller chercher ces données dynamiquement depuis votre API PostgreSQL.

## 📱 Spécificités Fonctionnelles à câbler

1. **Le Scanner d'Ordonnance** (`PatientDashboard.tsx > ScanPage`)
   - L'interface simule actuellement une IA d'extraction OCR. Vous devrez brancher ce bouton de Scan à votre véritable service d'OCR backend.
2. **Le Chat IA** (`PatientDashboard.tsx > ChatPage`)
   - Branchez l'input du chat sur votre endpoint d'Intelligence Artificielle.
3. **La Prédiction Épidémiologique** (`AdminDashboard.tsx > EpiPage`)
   - Ce module attend des données réelles de statistiques de vente groupées par zone géographique (données GPS ou noms de villes) pour fonctionner.

## 🎨 Design System
Si vous devez ajouter de nouvelles pages ou des boutons, utilisez les classes pré-existantes dans Tailwind :
- **Boutons** : `btn-primary`, `btn-dark`, `btn-ghost`
- **Inputs** : `form-input`
- **Cartes** : Ajouter les classes `bg-white rounded-3xl shadow-soft border border-gray-100`

Bon courage pour l'intégration de la base de données ! L'UI est prête et n'attend plus que vos API. ⚡
