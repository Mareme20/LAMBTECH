# MEDS - Diagrammes UML

Tous les diagrammes sont rédigés en **français** et compatibles **PlantUML**.

## Prévisualisation en ligne

Utilisez l'un de ces éditeurs :
- [PlantUML Online Editor](https://www.plantuml.com/plantuml/uml/)
- [Kroki](https://kroki.io/) (supporte PlantUML + autres formats)
- VS Code : extension **PlantUML** (+_PREVIEW)

## Génération locale

```bash
# Installation PlantUML
brew install plantuml        # macOS
sudo apt install plantuml    # Ubuntu/Debian

# Générer un diagramme
plantuml 01-usecase-diagram.puml

# Générer tous les diagrammes
plantuml *.puml
```

## Docker

```bash
docker run -it --rm -v $(pwd):/data plantuml/plantuml /data/*.puml
```

## Fichiers

| Fichier | Description |
|---------|-------------|
| `00-context-diagram.puml` | Diagramme de contexte - acteurs externes |
| `01-usecase-diagram.puml` | Cas d'utilisation (29 UC) par acteur |
| `02-class-diagram.puml` | Classes métiers et associations |
| `03-sequence-login-order.puml` | Séquence : authentification → commande → livraison |
| `04-activity-order-process.puml` | Activité : processus complet de commande |
| `05-component-diagram.puml` | Architecture composants backend |
| `06-state-diagram.puml` | États d'une commande |

## Architecture du système

```
┌─────────────────────────────────────────────────────────────┐
│                      Plateforme MEDS                        │
├───��─────────────────────────────────────────────────────────┤
│                                                             │
│   Frontend (React/Leaflet) ◄──────►  API Backend (Express)  │
│                                        │                    │
│                                    PostgreSQL               │
│                                        │                    │
│                               Service d'IA                 │
│                              (Gemini Vision)               │
│                                                             │
│   Socket.IO ◄─────────────────────►  Redis Cache            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                   ▼
   Google Maps       Wave Payment          Gemini IA
   (Géolocalisation) (Mobile Money)       (OCR Ordonnances
                                           + Chatbot)
```

## Acteurs

| Acteur | Rôle |
|--------|------|
| Client | Utilisateur recherchant médicaments et passant commandes |
| Pharmacien | Gère sa pharmacie, les stocks, accepte les commandes |
| Livreur | Effectue les livraisons, met à jour sa position GPS |
| Administrateur | Gère les utilisateurs et consulte les statistiques |
| Wave | Système externe de paiement mobile |
| Gemini IA | Système externe d'analyse d'images et chatbot |