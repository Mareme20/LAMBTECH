export class CreateCommandeDto {
  patientId!: number;
  pharmacieId!: number;
  montantTotal!: number;
  items!: {
    medicamentId: number;
    quantite: number;
    prixUnitaire: number;
  }[];
}