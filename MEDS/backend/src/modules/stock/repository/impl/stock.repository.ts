import { Repository }
from "typeorm";

import { AppDataSource }
from "../../../../database/data-source";

import { Stock }
from "../../entity/stock.entity";

export class StockRepository {

  private repository: Repository<Stock>;

  constructor() {

    this.repository =
      AppDataSource.getRepository(Stock);
  }

  async create(stock: Stock) {

    return await this.repository.save(stock);
  }

  async updateQuantity(
    pharmacieId: number,
    medicamentId: number,
    quantite: number
  ) {

    await this.repository.update(
      {
        pharmacieId,
        medicamentId,
      },
      {
        quantite,
      }
    );
  }

  async findAll(pharmacieId?: number) {
    const where = pharmacieId ? { pharmacieId } : {};
    return await this.repository.find({
      where,
      relations: [
        "pharmacie",
        "medicament",
      ],
    });
  }

  async findMedicationAvailability(
    medicationName: string,
    latitude: number,
    longitude: number
  ) {

    return await this.repository.query(
      `
      SELECT
        p.nom AS pharmacie,
        p.adresse,
        p.telephone,
        m."nomCommercial",
        s.quantite,

        ST_DistanceSphere(
          ST_MakePoint(
            p.longitude,
            p.latitude
          ),
          ST_MakePoint($1, $2)
        ) AS distance

      FROM stocks s

      INNER JOIN pharmacies p
      ON s."pharmacieId" = p.id

      INNER JOIN medicaments m
      ON s."medicamentId" = m.id

      WHERE
LOWER(m."nomCommercial")
      LIKE LOWER($3)

      AND s.quantite > 0

      ORDER BY distance ASC
      `,
      [
        longitude,
        latitude,
        `%${medicationName}%`,
      ]
    );
  }
}