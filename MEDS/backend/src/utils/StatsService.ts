import { AppDataSource } from "../database/data-source";
import { SearchLog } from "../modules/stats/entity/search_log.entity";

export class StatsService {
  private searchLogRepository = AppDataSource.getRepository(SearchLog);

  async getEpidemiologyStats() {
    // Retourne les médicaments les plus recherchés par zone
    return await this.searchLogRepository.query(`
      SELECT 
        "medicamentNom",
        COUNT(*) as total_recherches,
        AVG(latitude) as lat_moyenne,
        AVG(longitude) as lon_moyenne
      FROM search_logs
      GROUP BY "medicamentNom"
      ORDER BY total_recherches DESC
    `);
  }
}
