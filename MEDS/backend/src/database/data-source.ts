import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl && !(process.env.DB_HOST && process.env.DB_USERNAME && process.env.DB_NAME)) {
  // exactOptionalPropertyTypes: true => évite string | undefined
  console.warn("⚠️ DATABASE_URL manquant. Assurez-vous que DB_HOST/DB_USERNAME/DB_PASSWORD/DB_NAME sont définis.");
}

export const AppDataSource = new DataSource({
  type: "postgres",

// Prefer DATABASE

  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "5432"),
  username: process.env.DB_USERNAME ?? "",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "",


  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: ["src/modules/**/entity/*.{ts,js}"],
  migrations: ["src/database/migrations/*.{ts,js}"],
  subscribers: ["src/database/subscribers/*.{ts,js}"],
});
