import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { User }
from "../../auth/entity/user.entity";

import { Pharmacie }
from "../../pharmacie/entity/pharmacie.entity";

import { OrderStatus }
from "../../../shared/enums/order-status.enum";

@Entity("commandes")
export class Commande {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "patientId" })
  patient!: User;

  @Column("int")
  patientId!: number;

  @ManyToOne(() => Pharmacie)
  @JoinColumn({ name: "pharmacieId" })
  pharmacie!: Pharmacie;

  @Column("int")
  pharmacieId!: number;

  @Column("int", {
    nullable: true,
  })
  livreurId!: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.EN_ATTENTE,
  })
  statut!: OrderStatus;

  @Column("int")
  montantTotal!: number;

  @Column("varchar", {
    nullable: true,
  })
  referenceWave!: string;

  @CreateDateColumn()
  dateCommande!: Date;
}