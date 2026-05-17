import { MedicamentRepository } from "../repository/impl/MedicamentRepository";
import { PharmacieRepository } from "../../pharmacie/repository/impl/pharmacie.repository";
import { AppDataSource } from "../../../database/data-source";
import { SearchLog } from "../../stats/entity/search_log.entity";

export class MedicamentService {
  private repository = new MedicamentRepository();
  private pharmacieRepository = new PharmacieRepository();
  private searchLogRepository = AppDataSource.getRepository(SearchLog);

  async create(data: any) {
    return await this.repository.create(data);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async searchNearby(lat: number, lon: number, medicamentId: number, rayonKm: number) {
    // Log de la recherche pour les stats (anonyme)
    const medicament = await this.repository.findById(medicamentId);
    if (medicament) {
      await this.searchLogRepository.save({
        medicamentNom: medicament.nomCommercial,
        latitude: lat,
        longitude: lon
      });
    }

    return await this.pharmacieRepository.findWithStockAndDistance(lat, lon, medicamentId, rayonKm);
  }
}