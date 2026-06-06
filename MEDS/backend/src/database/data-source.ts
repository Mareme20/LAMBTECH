import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";

// Charge le .env local si on n'est pas sur Render
if (!process.env.RENDER) {
  dotenv.config();
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.warn("⚠️ DATABASE_URL manquant dans les variables d'environnement.");
}

// Sur Render avec npx tsx, on lit directement les fichiers .ts de src/
const isRender = process.env.RENDER === "true" || !!process.env.RENDER;

const options: DataSourceOptions = {
  type: "postgres",
  url: databaseUrl,
  // 💡 Configuration SSL obligatoire pour Neon sur Render
  ssl: isRender ? { rejectUnauthorized: false } : false,
  
  // 💡 Phase 1 du TODO : Conserver synchronize=true temporairement pour créer les tables
  synchronize: true, 
  logging: !isRender,

  // 💡 Puisqu'on utilise "npx tsx", on doit impérativement cibler le dossier "src/" et les fichiers ".ts"
  entities: ["src/modules/**/entity/*.ts"],
  migrations: ["src/database/migrations/*.ts"],
  subscribers: ["src/database/subscribers/*.ts"],
} as DataSourceOptions;

export const AppDataSource = new DataSource(options);

/**
 * Initialisation de la base de données avec reconnexions successives
 */
export async function initializeDataSourceWithRetry(retries = 5, delayMs = 2000): Promise<void> {
  let attempt = 0;
  while (true) {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log("🚀 Connexion à la base de données Neon réussie !");
      }
      return;
    } catch (err) {
      attempt++;
      if (attempt > retries) {
        console.error("❌ Impossible de se connecter à la base de données après 5 tentatives.");
        throw err;
      }
      const wait = delayMs * Math.pow(2, attempt - 1);
      console.warn(`DB connection failed (attempt ${attempt}/${retries}), retrying in ${wait}ms...`);
      console.error(`Détail de l'erreur :`, err);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, wait));
    }
  }
}
