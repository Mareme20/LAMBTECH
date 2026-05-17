import { Role } from "../../../shared/enums/role.enum";

export class RegisterDto {
  nomComplet!: string;
  telephone!: string;
  email!: string;
  motDePasse!: string;
  role!: Role;
}