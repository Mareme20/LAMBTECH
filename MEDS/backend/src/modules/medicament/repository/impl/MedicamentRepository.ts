import { Repository } from "typeorm";
import { AppDataSource } from "../../../../database/data-source";
import { Medicament } from "../../entity/medicament.entity";

export class MedicamentRepository {
  private repository: Repository<Medicament>;

  constructor() {
    this.repository =
      AppDataSource.getRepository(Medicament);
  }

  async create(data: Medicament) {
    return await this.repository.save(data);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findById(id: number) {
    return await this.repository.findOne({ where: { id } });
  }
}