import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl && !(process.env.DB_HOST && process.env.DB_USERNAME && process.env.DB_NAME)) {
  console.warn("⚠️ DATABASE_URL manquant. Assurez-vous que DB_HOST/DB_USERNAME/DB_PASSWORD/DB_NAME sont définis.");
}

const isProd = process.env.NODE_ENV === "production";

const options: DataSourceOptions = {
  type: "postgres",
  url: databaseUrl,
  host: !databaseUrl ? (process.env.DB_HOST ?? "localhost") : undefined,
  port: !databaseUrl ? parseInt(process.env.DB_PORT ?? "5432") : undefined,
  username: !databaseUrl ? (process.env.DB_USERNAME ?? "") : undefined,
  password: !databaseUrl ? (process.env.DB_PASSWORD ?? "") : undefined,
  database: !databaseUrl ? (process.env.DB_NAME ?? "") : undefined,
  ssl: isProd ? { rejectUnauthorized: false } : false,
  synchronize: !isProd,
  logging: process.env.NODE_ENV === "development",
  entities: [isProd ? "dist/modules/**/entity/*.js" : "src/modules/**/entity/*.ts"],
  migrations: [isProd ? "dist/database/migrations/*.js" : "src/database/migrations/*.ts"],
  subscribers: [isProd ? "dist/database/subscribers/*.js" : "src/database/subscribers/*.ts"],
} as DataSourceOptions;

export const AppDataSource = new DataSource(options);
