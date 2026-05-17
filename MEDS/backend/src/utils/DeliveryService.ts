import { AppDataSource } from "../database/data-source";
import { LivreurPosition } from "../modules/geolocalisation/entity/livreur_positions";
import { User } from "../modules/auth/entity/user.entity";
import { Role } from "../shared/enums/role.enum";

export class DeliveryService {
  private positionRepository = AppDataSource.getRepository(LivreurPosition);

  async findNearestLivreur(pharmacyLat: number, pharmacyLon: number) {
    // Requête pour trouver le livreur le plus proche
    // On pourrait utiliser ST_Distance ici aussi
    const nearest = await this.positionRepository.query(`
      SELECT 
        lp."livreurId",
        ST_Distance(
          ST_SetSRID(ST_MakePoint(lp.longitude, lp.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) / 1000 AS distance_km
      FROM livreur_positions lp
      INNER JOIN utilisateurs u ON u.id = lp."livreurId"
      WHERE u.role = $3
      ORDER BY distance_km ASC
      LIMIT 1
    `, [pharmacyLon, pharmacyLat, Role.LIVREUR]);

    return nearest.length > 0 ? nearest[0] : null;
  }
}
