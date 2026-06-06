import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";

// Load local .env only when explicitly in development or when LOAD_DOTENV=true
if (process.env.NODE_ENV === "development" || process.env.LOAD_DOTENV === "true") {
  dotenv.config();
}

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

/**
 * Initialize the data source with retries and exponential backoff.
 * @param retries number of retries (default 5)
 * @param delayMs base delay in ms (default 2000)
 */
export async function initializeDataSourceWithRetry(retries = 5, delayMs = 2000): Promise<void> {
  let attempt = 0;
  while (true) {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      return;
    } catch (err) {
      attempt++;
      if (attempt > retries) {
        throw err;
      }
      const wait = delayMs * Math.pow(2, attempt - 1);
      console.warn(`DB connection failed (attempt ${attempt}/${retries}), retrying in ${wait}ms...`);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, wait));
    }
  }
}
