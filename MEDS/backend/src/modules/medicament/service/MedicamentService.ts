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

  async update(id: number, data: any) {
    return await this.repository.update(id, data);
  }

  async delete(id: number) {
    return await this.repository.delete(id);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async searchNearby(lat: number, lon: number, medicamentId?: number, rayonKm: number = 10, searchTerm?: string) {
    if (medicamentId) {
      const medicament = await this.repository.findById(medicamentId);
      if (medicament) {
        await this.searchLogRepository.save({
          medicamentNom: medicament.nomCommercial,
          latitude: lat,
          longitude: lon
        });
      }
    } else if (searchTerm) {
      await this.searchLogRepository.save({
        medicamentNom: searchTerm,
        latitude: lat,
        longitude: lon
      });
    }

    const rawResults = await this.pharmacieRepository.findWithStockAndDistance(lat, lon, medicamentId, rayonKm, searchTerm);
    
    // Transformation des résultats plats en structure imbriquée attendue par le front
    return rawResults.map((r: any) => ({
      id: `${r.pharmacie_id}-${r.medicament_id}`,
      pharmacieId: r.pharmacie_id,
      medicamentId: r.medicament_id,
      quantite: r.stock_quantite,
      distance: Number(r.distance_km),
      medicament: {
        id: r.medicament_id,
        nomCommercial: r.medicament_nomCommercial,
        molecule: r.medicament_molecule,
        forme: r.medicament_forme,
        prixBase: Number(r.medicament_prixUnitaire) // Aligné avec frontend/src/presentation/pages/SearchPage.tsx:143
      },
      pharmacie: {
        id: r.pharmacie_id,
        nom: r.pharmacie_nom,
        telephone: r.pharmacie_telephone,
        adresse: r.pharmacie_adresse,
        latitude: Number(r.pharmacie_latitude),
        longitude: Number(r.pharmacie_longitude),
        estDeGarde: r.pharmacie_estDeGarde,
        statutActivation: r.pharmacie_statutActivation,
        heureOuverture: r.pharmacie_heureOuverture,
        heureFermeture: r.pharmacie_heureFermeture
      }
    }));
  }
}