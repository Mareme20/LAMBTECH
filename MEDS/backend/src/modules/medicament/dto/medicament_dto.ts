import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("medicaments")
export class Medicament {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nomCommercial!: string;

  @Column()
  molecule!: string;

  @Column()
  forme!: string;

  @Column()
  prixUnitaire!: number;
}