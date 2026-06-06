import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";

import { User }
from "../../auth/entity/user.entity";

import { Pharmacie }
from "../../pharmacie/entity/pharmacie.entity";

import { OrderStatus }
from "../../../shared/enums/order-status.enum";

import { ModeRecuperation }
from "../../../shared/enums/mode-recuperation.enum";

import { CommandeItem }
from "./commande-item.entity";

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

  @Column({
    type: "enum",
    enum: ModeRecuperation,
    default: ModeRecuperation.LIVRAISON,
  })
  modeRecuperation!: ModeRecuperation;

  @Column("int")
  montantTotal!: number;

  @Column("varchar", {
    nullable: true,
  })
  referenceWave!: string;

  @CreateDateColumn()
  dateCommande!: Date;

  @OneToMany(() => CommandeItem, (item) => item.commande, { cascade: true })
  items!: CommandeItem[];
}