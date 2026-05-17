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

  async findAll() {

    return await this.repository.find({
      relations: [
        "patient",
        "pharmacie",
      ],
    });
  }

  async findById(id: number) {

    return await this.repository.findOne({
      where: { id },
      relations: [
        "patient",
        "pharmacie",
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
}