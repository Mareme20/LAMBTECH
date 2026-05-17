import { Commande }
from "../../entity/commande.entity";

export interface ICommandeRepository {

  create(
    commande: Commande
  ): Promise<Commande>;

  findAll(): Promise<Commande[]>;

  findById(
    id: number
  ): Promise<Commande | null>;

  updateStatus(
    id: number,
    statut: string
  ): Promise<void>;
}