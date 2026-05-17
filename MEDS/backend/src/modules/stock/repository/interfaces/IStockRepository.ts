import { Stock }
from "../../entity/stock.entity";

export interface IStockRepository {

  create(stock: Stock): Promise<Stock>;

  updateQuantity(
    pharmacieId: number,
    medicamentId: number,
    quantite: number
  ): Promise<void>;

  findAll(): Promise<Stock[]>;

  findMedicationAvailability(
    medicationName: string,
    latitude: number,
    longitude: number
  ): Promise<any>;
}