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
    medicamentId?: number,
    rayonKm: number = 10,
    searchTerm?: string
  ) {
    let query = `
      SELECT 
        p.id as "pharmacie_id",
        p.nom as "pharmacie_nom",
        p.telephone as "pharmacie_telephone",
        p.adresse as "pharmacie_adresse",
        p.latitude as "pharmacie_latitude",
        p.longitude as "pharmacie_longitude",
        p."estDeGarde" as "pharmacie_estDeGarde",
        p."statutActivation" as "pharmacie_statutActivation",
        p."heureOuverture" as "pharmacie_heureOuverture",
        p."heureFermeture" as "pharmacie_heureFermeture",
        m.id as "medicament_id",
        m."nomCommercial" as "medicament_nomCommercial",
        m.molecule as "medicament_molecule",
        m.forme as "medicament_forme",
        m."prixUnitaire" as "medicament_prixUnitaire",
        s.quantite as "stock_quantite",
        ST_Distance(
          p.localisation, 
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) / 1000 AS distance_km
      FROM pharmacies p
      INNER JOIN stocks s ON s."pharmacieId" = p.id
      INNER JOIN medicaments m ON s."medicamentId" = m.id
      WHERE s.quantite > 0
        AND ST_DWithin(
          p.localisation, 
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 
          $3 * 1000
        )
    `;

    const params: any[] = [lon, lat, rayonKm];
    let paramCount = 3;

    if (medicamentId) {
      paramCount++;
      query += ` AND s."medicamentId" = $${paramCount}`;
      params.push(medicamentId);
    }

    if (searchTerm) {
      paramCount++;
      
      // On remplace les espaces par % pour une recherche flexible par mots-clés
      const normalizedSearch = `%${searchTerm.toString().trim().replace(/\s+/g, '%')}%`;
      
      // On cherche dans le nom, la molécule et la forme.
      // On gère aussi la variation 1g / 1000mg en faisant des remplacements dans la chaîne concaténée.
      query += ` AND (
        (m."nomCommercial" || ' ' || m.molecule || ' ' || m.forme) ILIKE $${paramCount}
        OR REPLACE(REPLACE(LOWER(m."nomCommercial" || ' ' || m.molecule || ' ' || m.forme), '1g', '1000mg'), '1 g', '1000mg') ILIKE LOWER($${paramCount})
        OR REPLACE(REPLACE(LOWER(m."nomCommercial" || ' ' || m.molecule || ' ' || m.forme), '1000mg', '1g'), '1000 mg', '1g') ILIKE LOWER($${paramCount})
      )`;

      params.push(normalizedSearch);
    }


    query += ` ORDER BY distance_km ASC`;

    return await this.repository.query(query, params);
  }
}