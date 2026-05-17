import { Pharmacie }
from "../../entity/pharmacie.entity";

export interface IPharmacieRepository {

  create(
    pharmacie: Pharmacie
  ): Promise<Pharmacie>;

  findAll(): Promise<Pharmacie[]>;

  findById(id: number):
    Promise<Pharmacie | null>;

  findNearby(
    latitude: number,
    longitude: number
  ): Promise<any>;
}