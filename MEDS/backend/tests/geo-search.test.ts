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

  it("should find pharmacies within a 5km radius with stock by medicamentId", async () => {
    // Coordonnées de test (Dakar Plateau par exemple)
    const lat = 14.7167;
    const lon = -17.4677;
    const medicamentId = 1;
    const rayon = 5;

    const results = await pharmacieRepo.findWithStockAndDistance(lat, lon, medicamentId, rayon);
    
    expect(Array.isArray(results)).toBe(true);
    if (results.length > 0) {
      expect(Number(results[0].distance_km)).toBeLessThanOrEqual(rayon);
      expect(results[0].stock_quantite).toBeGreaterThan(0);
    }
  });

  it("should find pharmacies by medication name", async () => {
    const lat = 14.7167;
    const lon = -17.4677;
    const searchTerm = "Paracétamol";
    const rayon = 10;

    const results = await pharmacieRepo.findWithStockAndDistance(lat, lon, undefined, rayon, searchTerm);
    
    expect(Array.isArray(results)).toBe(true);
    if (results.length > 0) {
      expect(results[0].medicament_nomCommercial).toMatch(/Paracétamol/i);
    }
  });
});
