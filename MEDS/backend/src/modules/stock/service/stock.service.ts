import { CreateStockDto }
from "../dto/create-stock.dto";

import { UpdateStockDto }
from "../dto/update-stock.dto";

import { StockRepository }
from "../repository/impl/stock.repository";

export class StockService {

  private repository =
    new StockRepository();

  async create(
    data: CreateStockDto
  ) {

    return await this.repository.create(
      data as any
    );
  }

  async updateQuantity(
    pharmacieId: number,
    medicamentId: number,
    data: UpdateStockDto
  ) {

    return await this.repository.updateQuantity(
      pharmacieId,
      medicamentId,
      data.quantite
    );
  }

  async findAll(pharmacieId?: number) {
    return await this.repository.findAll(pharmacieId);
  }

  async searchMedication(
    medicationName: string,
    latitude: number,
    longitude: number
  ) {

    return await this.repository
      .findMedicationAvailability(
        medicationName,
        latitude,
        longitude
      );
  }
}