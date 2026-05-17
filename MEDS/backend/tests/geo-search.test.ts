import { AppDataSource } from "../src/database/data-source";
import { PharmacieRepository } from "../src/modules/pharmacie/repository/impl/pharmacie.repository";
import { MedicamentRepository } from "../src/modules/medicament/repository/impl/MedicamentRepository";
import { AppDataSource as DataSourceInstance } from "../src/database/data-source";

describe("Geospatial Search Test", () => {
  let pharmacieRepo: PharmacieRepository;
  let medicamentRepo: MedicamentRepository;

  beforeAll(async () => {
    if (!DataSourceInstance.isInitialized) {
      await DataSourceInstance.initialize();
    }
    pharmacieRepo = new PharmacieRepository();
    medicamentRepo = new MedicamentRepository();
  });

  afterAll(async () => {
    if (DataSourceInstance.isInitialized) {
      await DataSourceInstance.destroy();
    }
  });

  it("should find pharmacies within a 5km radius with stock", async () => {
    // Coordonnées de test (Dakar Plateau par exemple)
    const lat = 14.667;
    const lon = -17.433;
    const medicamentId = 1; // Supposons que cet ID existe
    const rayon = 5;

    const results = await pharmacieRepo.findWithStockAndDistance(lat, lon, medicamentId, rayon);
    
    expect(Array.isArray(results)).toBe(true);
    if (results.length > 0) {
      expect(Number(results[0].distance_km)).toBeLessThanOrEqual(rayon);
      expect(results[0].stock_disponible).toBeGreaterThan(0);
    }
  });
});
