import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

import { Role } from "../../../shared/enums/role.enum";

@Entity("utilisateurs")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  nomComplet!: string;

  @Column("varchar", { unique: true })
  telephone!: string;

  @Column("varchar", { unique: true })
  email!: string;

  @Column("varchar")
  motDePasse!: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.PATIENT,
  })
  role!: Role;

  @Column("varchar", { nullable: true })
  adresseDefaut!: string;

  @CreateDateColumn()
  dateCreation!: Date;
}