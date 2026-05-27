import { Server, Socket } from "socket.io";
import { AppDataSource } from "../database/data-source";
import { LivreurPosition } from "../modules/geolocalisation/entity/livreur_positions";

// Définition de l'interface correspondant strictement aux données envoyées par votre React
interface UpdatePositionPayload {
  livreurId: number;
  latitude: number;
  longitude: number;
}

export class DeliveryGateway {
  private positionRepository = AppDataSource.getRepository(LivreurPosition);

  constructor(private io: Server) {
    this.initializeEvents();
  }

  private initializeEvents() {
    console.log("[Socket.IO] Passerelle de géolocalisation des livreurs initialisée.");

    this.io.on("connection", (socket: Socket) => {
      console.log(`[Socket.IO] Appareil connecté : ${socket.id}`);

      // 1. Écoute de l'événement 'update_position' déclenché toutes les 5 secondes par le frontend
      socket.on("update_position", async (payload: UpdatePositionPayload) => {
        const { livreurId, latitude, longitude } = payload;

        if (!livreurId || !latitude || !longitude) return;

        try {
          // 2. Recherche si le livreur possède déjà une ligne de position enregistrée
          let currentPosition = await this.positionRepository.findOne({
            where: { livreurId: livreurId }
          });

          if (!currentPosition) {
            // Création d'une nouvelle ligne si c'est sa première connexion
            currentPosition = this.positionRepository.create({ livreurId });
          }

          // 3. Mise à jour des coordonnées géographiques
          currentPosition.latitude = latitude;
          currentPosition.longitude = longitude;
          currentPosition.updatedAt = new Date(); // Crucial pour le filtre des 30 minutes de DeliveryService

          // 4. Enregistrement en base de données
          await this.positionRepository.save(currentPosition);

          // 5. Optionnel : Rediffusion en temps réel aux clients ou pharmacies qui suivent la livraison
          this.io.emit(`livreur_${livreurId}_moved`, { latitude, longitude });

        } catch (error) {
          console.error(`[Socket.IO] Échec de la mise à jour GPS pour le livreur ${livreurId}:`, error);
        }
      });

      socket.on("disconnect", () => {
        console.log(`[Socket.IO] Appareil déconnecté : ${socket.id}`);
      });
    });
  }
}
