import { ModeRecuperation } from "../../../shared/enums/mode-recuperation.enum";

export class CreateCommandeDto {
  patientId!: number;
  pharmacieId!: number;
  montantTotal!: number;
  modeRecuperation?: ModeRecuperation;
  items!: {
    medicamentId: number;
    quantite: number;
    prixUnitaire: number;
  }[];
}