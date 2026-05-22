import { AppDataSource } from "../database/data-source";
import { LivreurPosition } from "../modules/geolocalisation/entity/livreur_positions";
import { Role } from "../shared/enums/role.enum";

// Définition de l'interface de retour pour un typage TypeScript strict
interface NearestLivreurResult {
  livreurId: number;
  distance_km: number;
}

export class DeliveryService {
  private positionRepository = AppDataSource.getRepository(LivreurPosition);

  async findNearestLivreur(pharmacyLat: number, pharmacyLon: number): Promise<NearestLivreurResult | null> {
    console.log(`[Livraison] Recherche du livreur le plus proche des coordonnées (${pharmacyLat}, ${pharmacyLon})...`);

    try {
      // Spécification du type attendu dans le tableau de résultats pour éviter les erreurs de type 'any'
      const results = await this.positionRepository.query<{ livreurId: string | number; distance_km: string | number }[]>(`
        SELECT 
          lp."livreurId",
          CAST(
            ST_Distance(
              ST_SetSRID(ST_MakePoint(lp.longitude, lp.latitude), 4326)::geography,
              ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
            ) / 1000 AS DOUBLE PRECISION
          ) AS distance_km
        FROM livreur_positions lp
        INNER JOIN utilisateurs u ON u.id = lp."livreurId"
        WHERE u.role = $3
          AND lp.updated_at >= NOW() - INTERVAL '30 minutes' -- SÉCURITÉ : Exclut les livreurs inactifs ou déconnectés
        ORDER BY distance_km ASC
        LIMIT 1;
      `, [pharmacyLon, pharmacyLat, Role.LIVREUR]);

      // Vérification sécurisée de l'existence du premier index du tableau
      if (results && results.length > 0 && results[0]) {
        const firstMatch = results[0];
        
        return {
          livreurId: Number(firstMatch.livreurId),
          distance_km: Number(firstMatch.distance_km)
        };
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de la recherche du livreur le plus proche :", error);
      throw new Error("Impossible de géolocaliser un livreur à proximité.");
    }
  }
}
