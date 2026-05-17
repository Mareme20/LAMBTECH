import { Server } from "socket.io";

let io: Server;

export const initializeSocket = (
  server: any
) => {

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {

    console.log(
      "Utilisateur connecté :",
      socket.id
    );

   socket.on(
  "position_livreur",
  (data) => {

    io.emit(
      "livreur_position_update",
      data
    );
  }
);
  });

  return io;
};

export const getIO = () => {

  if (!io) {
    throw new Error(
      "Socket.IO non initialisé"
    );
  }

  return io;
};