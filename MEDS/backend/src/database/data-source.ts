import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
  type: "postgres",

  // Prefer DATABASE_URL (docker-compose sets it), and fall back to DB_* vars.
  // This avoids passing `undefined` to pg as the password.
  url: databaseUrl,

  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: ["src/modules/**/entity/*.{ts,js}"],
  migrations: ["src/database/migrations/*.{ts,js}"],
  subscribers: ["src/database/subscribers/*.{ts,js}"],
});
