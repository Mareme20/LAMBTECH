import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Commande } from "./commande.entity";
import { Medicament } from "../../medicament/entity/medicament.entity";

@Entity("commande_items")
export class CommandeItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Commande, (commande) => (commande as any).items)
  @JoinColumn({ name: "commandeId" })
  commande!: Commande;

  @Column("int")
  commandeId!: number;

  @ManyToOne(() => Medicament)
  @JoinColumn({ name: "medicamentId" })
  medicament!: Medicament;

  @Column("int")
  medicamentId!: number;

  @Column("int")
  quantite!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  prixUnitaire!: number;
}
