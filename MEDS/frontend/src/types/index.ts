export enum UserRole {
  PATIENT = 'PATIENT',
  PHARMACIE = 'PHARMACIE',
  LIVREUR = 'LIVREUR',
  ADMIN = 'ADMIN',
  DISTRICT = 'DISTRICT',
}

export interface User {
  id: number;
  email: string;
  nom: string;
  role: UserRole;
  telephone?: string;
  adresse?: string;
  isActive: boolean;
  pharmacieId?: number;
}

export interface Medicament {
  id: number;
  nomCommercial: string;
  molecule: string;
  forme: string;
  prixUnitaire: number;
}

export interface Pharmacie {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  latitude: number;
  longitude: number;
}

export interface CommandeItem {
  id: number;
  medicament: Medicament;
  quantite: number;
  prixUnitaire: number;
}

export interface Commande {
  id: number;
  patient: User;
  pharmacie: Pharmacie;
  montantTotal: number;
  status: string;
  dateCreation: string;
  items: CommandeItem[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
