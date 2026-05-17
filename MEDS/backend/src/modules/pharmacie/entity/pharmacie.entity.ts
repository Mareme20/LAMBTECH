import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("pharmacies")
export class Pharmacie {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  nom!: string;

  @Column("varchar")
  telephone!: string;

  @Column("text")
  adresse!: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 8,
  })
  latitude!: number;

  @Column({
    type: "decimal",
    precision: 11,
    scale: 8,
  })
  longitude!: number;

  @Column("boolean", {
    default: false,
  })
  estDeGarde!: boolean;

  @Column("boolean", {
    default: false,
  })
  statutActivation!: boolean;

  @Column("varchar")
  heureOuverture!: string;

  @Column("varchar")
  heureFermeture!: string;

@Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
  })
  localisation!: string;

  @CreateDateColumn()
  dateCreation!: Date;
}