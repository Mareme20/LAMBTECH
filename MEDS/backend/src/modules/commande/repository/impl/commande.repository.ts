import { Repository }
from "typeorm";

import { AppDataSource }
from "../../../../database/data-source";

import { Commande }
from "../../entity/commande.entity";

export class CommandeRepository {

  private repository: Repository<Commande>;

  constructor() {

    this.repository =
      AppDataSource.getRepository(Commande);
  }

  async create(
    commande: Commande
  ) {

    return await this.repository.save(
      commande
    );
  }

  async findAll(pharmacieId?: number, patientId?: number, livreurId?: number) {
    const where: any = {};
    if (pharmacieId) where.pharmacieId = pharmacieId;
    if (patientId) where.patientId = patientId;
    if (livreurId) where.livreurId = livreurId;

    return await this.repository.find({
      where,
      relations: [
        "patient",
        "pharmacie",
        "items",
        "items.medicament"
      ],
      order: { dateCommande: 'DESC' }
    });
  }

  async findById(id: number) {

    return await this.repository.findOne({
      where: { id },
      relations: [
        "patient",
        "pharmacie",
        "items",
        "items.medicament"
      ],
    });
  }

  async updateStatus(
    id: number,
    statut: string
  ) {

    await this.repository.update(
      { id },
      { statut: statut as any }
    );
  }

  async assignLivreur(id: number, livreurId: number) {
    await this.repository.update(
      { id },
      { livreurId }
    );
  }
}