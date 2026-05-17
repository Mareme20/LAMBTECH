import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import http from "http";

import app from "./app";

import { AppDataSource }
from "./database/data-source";

import {
  initializeSocket
}
from "./socket/socket.server";

const PORT =
  process.env.PORT || 5000;

const server =
  http.createServer(app);

initializeSocket(server);

AppDataSource.initialize()
  .then(() => {

    server.listen(PORT, () => {

      console.log(
        `Serveur lancé sur ${PORT}`
      );
    });
  })
  .catch((error: unknown) => {
    console.log(error);
  });