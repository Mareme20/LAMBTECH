import { Repository } from "typeorm";

import { AppDataSource }
from "../../../../database/data-source";

import { Pharmacie }
from "../../entity/pharmacie.entity";

export class PharmacieRepository {

  private repository: Repository<Pharmacie>;

  constructor() {
    this.repository =
      AppDataSource.getRepository(Pharmacie);
  }

  async create(
    pharmacie: Pharmacie
  ): Promise<Pharmacie> {

    return await this.repository.save(pharmacie);
  }

  async findAll(): Promise<Pharmacie[]> {

    return await this.repository.find();
  }

  async findById(
    id: number
  ): Promise<Pharmacie | null> {

    return await this.repository.findOne({
      where: { id },
    });
  }

 
  async findNearby(
    latitude: number,
    longitude: number
  ) {

    return await this.repository.query(
      `
    SELECT
      *,
      ST_Distance(
        localisation,
        ST_SetSRID(
          ST_MakePoint($1, $2),
          4326
        )::geography
      ) AS distance

    FROM pharmacies

    ORDER BY distance ASC

    LIMIT 10
    `,
      [longitude, latitude]
    );
  }

  async findWithStockAndDistance(
    lat: number,
    lon: number,
    medicamentId: number,
    rayonKm: number
  ) {
    return await this.repository.query(
      `
      SELECT 
        p.*, 
        s.quantite as stock_disponible,
        ST_Distance(
          p.localisation, 
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) / 1000 AS distance_km
      FROM pharmacies p
      INNER JOIN stocks s ON s."pharmacieId" = p.id
      WHERE s."medicamentId" = $3 
        AND s.quantite > 0
        AND ST_DWithin(
          p.localisation, 
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 
          $4 * 1000
        )
      ORDER BY distance_km ASC
      `,
      [lon, lat, medicamentId, rayonKm]
    );
  }
}