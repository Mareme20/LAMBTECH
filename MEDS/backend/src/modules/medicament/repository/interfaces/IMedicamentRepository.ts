import { Medicament } from "../../entity/medicament.entity";

export interface IMedicamentRepository {
  create(data: Medicament): Promise<Medicament>;
  findAll(): Promise<Medicament[]>;
}