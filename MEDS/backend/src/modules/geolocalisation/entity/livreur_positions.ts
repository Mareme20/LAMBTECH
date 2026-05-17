import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity("livreur_positions")
export class LivreurPosition {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  livreurId!: number;

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

  @UpdateDateColumn()
  updatedAt!: Date;
}