import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("medicaments")
export class Medicament {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  nomCommercial!: string;

  @Column({ type: "varchar", length: 255 })
  molecule!: string;

  @Column({ type: "varchar", length: 255 })
  forme!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  prixUnitaire!: number;
}