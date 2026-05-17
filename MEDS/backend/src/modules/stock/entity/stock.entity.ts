import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
  UpdateDateColumn,
} from "typeorm";

import { Pharmacie }
from "../../pharmacie/entity/pharmacie.entity";

import { Medicament }
from "../../medicament/entity/medicament.entity";

@Entity("stocks")
export class Stock {

  @PrimaryColumn("int")
  pharmacieId!: number;

  @PrimaryColumn("int")
  medicamentId!: number;

  @ManyToOne(() => Pharmacie)
  @JoinColumn({ name: "pharmacieId" })
  pharmacie!: Pharmacie;

  @ManyToOne(() => Medicament)
  @JoinColumn({ name: "medicamentId" })
  medicament!: Medicament;

  @Column("int")
  quantite!: number;

  @UpdateDateColumn()
  derniereMaj!: Date;
}