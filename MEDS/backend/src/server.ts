import "reflect-metadata";
import dotenv from "dotenv";

// Load local .env only when explicitly in development or when LOAD_DOTENV=true
if (process.env.NODE_ENV === "development" || process.env.LOAD_DOTENV === "true") {
  dotenv.config();
}

import http from "http";

import app from "./app";

import { AppDataSource, initializeDataSourceWithRetry } from "./database/data-source";

import { initializeSocket } from "./socket/socket.server";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Serveur lancé sur ${PORT}`);
});

// Initialize DB with retry/backoff — do not block server listen
initializeDataSourceWithRetry(5, 2000)
  .then(() => console.log("Base de données initialisée"))
  .catch((error: unknown) => console.error("Initialisation DB échouée:", error));