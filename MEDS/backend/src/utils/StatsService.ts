import { AppDataSource } from "../database/data-source";
import { SearchLog } from "../modules/stats/entity/search_log.entity";

export class StatsService {
  private searchLogRepository = AppDataSource.getRepository(SearchLog);

  async getEpidemiologyStats() {
    console.log("[Stats] Calcul des statistiques épidémiologiques en cours...");

    try {
      // CORRECTION : Forcer le typage du résultat du COUNT (PostgreSQL renvoie par défaut un type string pour COUNT)
      // Ajustement des guillemets pour correspondre au standard de nommage PostgreSQL
      return await this.searchLogRepository.query(`
        SELECT 
          "medicamentNom",
          CAST(COUNT(*) AS INTEGER) as total_recherches,
          ROUND(CAST(AVG(latitude) AS NUMERIC), 4) as avg_lat,
          ROUND(CAST(AVG(longitude) AS NUMERIC), 4) as avg_lon
        FROM search_logs
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        GROUP BY "medicamentNom"
        ORDER BY total_recherches DESC
        LIMIT 10;
      `);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques :", error);
      throw new Error("Impossible de charger les données épidémiologiques.");
    }
  }
}
