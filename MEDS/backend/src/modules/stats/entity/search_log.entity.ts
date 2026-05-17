import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("search_logs")
export class SearchLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  medicamentNom!: string;

  @Column({ type: "decimal", precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: "decimal", precision: 11, scale: 8 })
  longitude!: number;

  @CreateDateColumn()
  dateRecherche!: Date;
}
