import { CreatePharmacieDto }
from "../dto/create-pharmacie.dto";

import { PharmacieRepository }
from "../repository/impl/pharmacie.repository";

export class PharmacieService {

  private repository =
    new PharmacieRepository();

 async create(data: CreatePharmacieDto) {

  const pharmacie = {
    ...data,

    localisation: `SRID=4326;POINT(
      ${data.longitude}
      ${data.latitude}
    )`,
  };

  return await this.repository.create(
    pharmacie as any
  );
}

  async findAll() {

    return await this.repository.findAll();
  }

  async findNearby(
    latitude: number,
    longitude: number
  ) {

    return await this.repository.findNearby(
      latitude,
      longitude
    );
  }
}