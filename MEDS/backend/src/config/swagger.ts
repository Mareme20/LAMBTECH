import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MEDS API",
      version: "1.0.0",
      description: "API pour la plateforme MEDS - Gestion de médicaments, pharmacies et commandes",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
            statusCode: { type: "integer" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string", format: "email" },
            nom: { type: "string" },
            prenom: { type: "string" },
            role: { type: "string", enum: ["client", "pharmacien", "livreur", "admin"] },
            telephone: { type: "string" },
            estActif: { type: "boolean" },
          },
        },
        Medicament: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nomCommercial: { type: "string" },
            molecule: { type: "string" },
            forme: { type: "string" },
            prixUnitaire: { type: "number" },
          },
        },
        Pharmacie: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nom: { type: "string" },
            telephone: { type: "string" },
            adresse: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
            estDeGarde: { type: "boolean" },
            statutActivation: { type: "boolean" },
            heureOuverture: { type: "string" },
            heureFermeture: { type: "string" },
            localisation: { type: "string" },
            dateCreation: { type: "string", format: "date-time" },
          },
        },
        Stock: {
          type: "object",
          properties: {
            pharmacieId: { type: "integer" },
            medicamentId: { type: "integer" },
            quantite: { type: "integer" },
            pharmacie: { $ref: "#/components/schemas/Pharmacie" },
            medicament: { $ref: "#/components/schemas/Medicament" },
            derniereMaj: { type: "string", format: "date-time" },
          },
        },
        Commande: {
          type: "object",
          properties: {
            id: { type: "integer" },
            clientId: { type: "integer" },
            statut: { type: "string", enum: ["en_attente", "acceptee", "en_preparation", "expadiee", "livree", "annulee"] },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  medicamentId: { type: "integer" },
                  medicament: { $ref: "#/components/schemas/Medicament" },
                  quantite: { type: "integer" },
                  prixUnitaire: { type: "number" },
                },
              },
            },
            montantTotal: { type: "number" },
            dateCreation: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Endpoints d'authentification et gestion des utilisateurs" },
      { name: "Medicaments", description: "Gestion des médicaments" },
      { name: "Pharmacies", description: "Gestion des pharmacies" },
      { name: "Stocks", description: "Gestion des stocks de médicaments" },
      { name: "Commandes", description: "Gestion des commandes" },
      { name: "AI", description: "Endpoints d'intelligence artificielle (OCR, chat)" },
      { name: "Payment", description: "Webhooks de paiement Wave" },
      { name: "Stats", description: "Statistiques et épidémiologie" },
    ],
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Inscrire un nouvel utilisateur",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "motDePasse", "nom", "prenom", "role"],
                  properties: {
                    email: { type: "string", format: "email", description: "Email de l'utilisateur" },
                    motDePasse: { type: "string", minLength: 6, description: "Mot de passe (min 6 caractères)" },
                    nom: { type: "string", description: "Nom de famille" },
                    prenom: { type: "string", description: "Prénom" },
                    role: { type: "string", enum: ["CLIENT", "PHARMACIEN", "LIVREUR", "ADMIN"], description: "Rôle de l'utilisateur" },
                    telephone: { type: "string", description: "Numéro de téléphone" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Utilisateur créé avec succès" },
            400: { description: "Données invalides" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Connexion utilisateur",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "motDePasse"],
                  properties: {
                    email: { type: "string", format: "email" },
                    motDePasse: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Connexion réussie - Retourne un token JWT" },
            401: { description: "Identifiants invalides" },
          },
        },
      },
      "/api/auth/users": {
        get: {
          tags: ["Auth"],
          summary: "Récupérer tous les utilisateurs",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Liste des utilisateurs",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
      "/api/auth/users/{id}/toggle-status": {
        put: {
          tags: ["Auth"],
          summary: "Activer/Désactiver un utilisateur",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID de l'utilisateur" },
          ],
          responses: {
            200: { description: "Statut de l'utilisateur mis à jour" },
          },
        },
      },
      "/api/auth/users/{id}": {
        delete: {
          tags: ["Auth"],
          summary: "Supprimer un utilisateur",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID de l'utilisateur" },
          ],
          responses: {
            200: { description: "Utilisateur supprimé" },
          },
        },
      },
      "/api/medicaments": {
        get: {
          tags: ["Medicaments"],
          summary: "Récupérer tous les médicaments",
          responses: {
            200: {
              description: "Liste des médicaments",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Medicament" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Medicaments"],
          summary: "Créer un nouveau médicament",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nomCommercial", "molecule", "forme", "prixUnitaire"],
                  properties: {
                    nomCommercial: { type: "string", description: "Nom commercial du médicament" },
                    molecule: { type: "string", description: "Nom de la molécule active" },
                    forme: { type: "string", description: "Forme pharmaceuticale (comprimé, syrup, etc.)" },
                    prixUnitaire: { type: "number", description: "Prix unitaire" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Médicament créé" },
          },
        },
      },
      "/api/medicaments/nearby": {
        get: {
          tags: ["Medicaments"],
          summary: "Rechercher les médicaments à proximité",
          parameters: [
            { name: "lat", in: "query", required: true, schema: { type: "number" }, description: "Latitude de la position" },
            { name: "lng", in: "query", required: true, schema: { type: "number" }, description: "Longitude de la position" },
            { name: "rayon", in: "query", schema: { type: "number" }, description: "Rayon de recherche en km (optionnel)" },
          ],
          responses: {
            200: { description: "Médicaments trouvés dans le rayon spécifié" },
          },
        },
      },
      "/api/medicaments/{id}": {
        put: {
          tags: ["Medicaments"],
          summary: "Mettre à jour un médicament",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID du médicament" },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nomCommercial: { type: "string" },
                    molecule: { type: "string" },
                    forme: { type: "string" },
                    prixUnitaire: { type: "number" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Médicament mis à jour" },
          },
        },
        delete: {
          tags: ["Medicaments"],
          summary: "Supprimer un médicament",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID du médicament" },
          ],
          responses: {
            200: { description: "Médicament supprimé" },
          },
        },
      },
      "/api/pharmacies": {
        get: {
          tags: ["Pharmacies"],
          summary: "Récupérer toutes les pharmacies",
          responses: {
            200: {
              description: "Liste des pharmacies",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Pharmacie" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Pharmacies"],
          summary: "Créer une nouvelle pharmacie",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nom", "adresse", "latitude", "longitude", "telephone"],
                  properties: {
                    nom: { type: "string", description: "Nom de la pharmacie" },
                    adresse: { type: "string", description: "Adresse complète" },
                    latitude: { type: "number", description: "Latitude GPS" },
                    longitude: { type: "number", description: "Longitude GPS" },
                    telephone: { type: "string", description: "Numéro de téléphone" },
                    estDeGarde: { type: "boolean", description: "Pharmacie de garde?" },
                    heureOuverture: { type: "string", description: "Heure d'ouverture (ex: 08:00)" },
                    heureFermeture: { type: "string", description: "Heure de fermeture (ex: 20:00)" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Pharmacie créée" },
          },
        },
      },
      "/api/pharmacies/nearby": {
        get: {
          tags: ["Pharmacies"],
          summary: "Trouver les pharmacies à proximité",
          parameters: [
            { name: "lat", in: "query", required: true, schema: { type: "number" }, description: "Latitude" },
            { name: "lng", in: "query", required: true, schema: { type: "number" }, description: "Longitude" },
          ],
          responses: {
            200: { description: "Pharmacies proches triées par distance" },
          },
        },
      },
      "/api/stocks": {
        get: {
          tags: ["Stocks"],
          summary: "Récupérer tous les stocks",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Liste des stocks",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Stock" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Stocks"],
          summary: "Créer ou mettre à jour un stock",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["pharmacieId", "medicamentId", "quantite"],
                  properties: {
                    pharmacieId: { type: "integer", description: "ID de la pharmacie" },
                    medicamentId: { type: "integer", description: "ID du médicament" },
                    quantite: { type: "integer", description: "Quantité en stock" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Stock créé/mis à jour" },
          },
        },
      },
      "/api/stocks/search": {
        get: {
          tags: ["Stocks"],
          summary: "Rechercher un médicament en stock",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "medicamentId", in: "query", required: true, schema: { type: "integer" }, description: "ID du médicament" },
            { name: "lat", in: "query", schema: { type: "number" }, description: "Latitude pour filtrer par proximité" },
            { name: "lng", in: "query", schema: { type: "number" }, description: "Longitude pour filtrer par proximité" },
            { name: "rayon", in: "query", schema: { type: "number" }, description: "Rayon de recherche en km" },
          ],
          responses: {
            200: { description: "Résultats de recherche avec pharmacies disposant du stock" },
          },
        },
      },
      "/api/stocks/{pharmacieId}/{medicamentId}": {
        put: {
          tags: ["Stocks"],
          summary: " Mettre à jour la quantité d'un stock",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "pharmacieId", in: "path", required: true, schema: { type: "integer" } },
            { name: "medicamentId", in: "path", required: true, schema: { type: "integer" } },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["quantite"],
                  properties: {
                    quantite: { type: "integer" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Quantité mise à jour" },
          },
        },
      },
      "/api/commandes": {
        get: {
          tags: ["Commandes"],
          summary: "Récupérer toutes les commandes",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Liste des commandes",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Commande" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Commandes"],
          summary: "Créer une nouvelle commande",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["items"],
                  properties: {
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          medicamentId: { type: "integer" },
                          quantite: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Commande créée" },
          },
        },
      },
      "/api/commandes/{id}": {
        get: {
          tags: ["Commandes"],
          summary: "Récupérer une commande par ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            200: {
              description: "Détails de la commande",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Commande" },
                },
              },
            },
          },
        },
      },
      "/api/commandes/{id}/status": {
        put: {
          tags: ["Commandes"],
          summary: "Mettre à jour le statut d'une commande",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statut: {
                      type: "string",
                      enum: ["en_attente", "acceptee", "en_preparation", "expadiee", "livree", "annulee"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Statut de la commande mis à jour" },
          },
        },
      },
      "/api/ai/scan": {
        post: {
          tags: ["AI"],
          summary: "Scanner une ordonnance (OCR)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    prescription: { type: "string", format: "binary", description: "Image de l'ordonnance" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Résultat de la reconnaissance OCR - Liste des médicaments détectés" },
          },
        },
      },
      "/api/ai/chat": {
        post: {
          tags: ["AI"],
          summary: "Chatbot IA pour assistance",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", description: "Message de l'utilisateur" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Réponse du chatbot" },
          },
        },
      },
      "/api/payment/wave/webhook": {
        post: {
          tags: ["Payment"],
          summary: "Webhook Wave pour notifications de paiement",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    transactionId: { type: "string" },
                    status: { type: "string" },
                    amount: { type: "number" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Webhook reçu et traité" },
          },
        },
      },
      "/api/stats/epidemiology": {
        get: {
          tags: ["Stats"],
          summary: "Récupérer les données épidémiologiques",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Données épidémiologiques" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);