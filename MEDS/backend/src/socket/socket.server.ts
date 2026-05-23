import { Server } from "socket.io";
import { AppDataSource } from "../database/data-source";
import { LivreurPosition } from "../modules/geolocalisation/entity/livreur_positions";

let io: Server;

// Interface pour typer proprement les données reçues du frontend React
interface UpdatePositionPayload {
  livreurId: number;
  latitude: number;
  longitude: number;
}

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // Récupération du repository TypeORM
  const positionRepository = AppDataSource.getRepository(LivreurPosition);

  io.on("connection", (socket) => {
    console.log("Utilisateur connecté :", socket.id);

    // Écoute de l'événement exact émis par le frontend de vos livreurs
    socket.on("update_position", async (data: UpdatePositionPayload) => {
      const { livreurId, latitude, longitude } = data;

      if (!livreurId || !latitude || !longitude) return;

      try {
        // 1. Sauvegarde en Base de données pour le calcul PostGIS de proximité
        let currentPosition = await positionRepository.findOne({
          where: { livreurId: livreurId }
        });

        if (!currentPosition) {
          currentPosition = positionRepository.create({ livreurId });
        }

        currentPosition.latitude = latitude;
        currentPosition.longitude = longitude;
        currentPosition.updatedAt = new Date();

        await positionRepository.save(currentPosition);

        // 2. Rediffusion en temps réel (Utile si un client suit son livreur sur une carte)
        io.emit("livreur_position_update", {
          livreurId,
          latitude,
          longitude
        });

      } catch (error) {
        console.error(`[Socket.IO Erreur] Échec de mise à jour de la position du livreur ${livreurId}:`, error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Utilisateur déconnecté :", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO non initialisé");
  }
  return io;
};
