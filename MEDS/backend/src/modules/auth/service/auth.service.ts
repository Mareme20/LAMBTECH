import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";

import { UserRepository } from "../repository/impl/user.repository";

export class AuthService {
  private repository = new UserRepository();

  async register(data: RegisterDto) {
    const userExists =
      await this.repository.findByEmail(data.email);

    if (userExists) {
      throw new Error("Email déjà utilisé");
    }

    const hashedPassword =
      await bcrypt.hash(data.motDePasse, 10);

    // Admin flow: when a PHARMACIE user is created without pharmacieId,
    // auto-create a default Pharmacie at Dakar and bind user.pharmacieId.
    let pharmacieId: number | undefined = data.pharmacieId;

    if (data.role === "PHARMACIE" && !pharmacieId) {
      const { PharmacieService } = await import(
        "../../pharmacie/service/pharmacie.service"
      );

      const pharmacieService = new PharmacieService();

      // Default Dakar pharmacy (generic)
      const created = await pharmacieService.create({
        nom: "Pharmacie (Auto) Dakar",
        telephone: "+221000000000",
        adresse: "Dakar",
        latitude: 14.7167,
        longitude: -17.4677,
        heureOuverture: "08:00",
        heureFermeture: "22:00",
      } as any);

      pharmacieId = created.id;
    }

    const user = {
      ...data,
      pharmacieId,
      motDePasse: hashedPassword,
    };

    return await this.repository.create(user as any);
  }

  async login(data: LoginDto) {

    const user =
      await this.repository.findByEmail(data.email);

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    const isValid = await bcrypt.compare(
      data.motDePasse,
      user.motDePasse
    );

    if (!isValid) {
      throw new Error("Mot de passe incorrect");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        pharmacieId: user.pharmacieId,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return {
      token,
      user: {
        id: user.id,
        nom: user.nomComplet,
        email: user.email,
        role: user.role,
        pharmacieId: user.pharmacieId,
      },
    };
  }

  async getAllUsers() {
    const users = await this.repository.findAll();
    return users.map(u => ({
      id: u.id,
      nom: u.nomComplet,
      email: u.email,
      role: u.role,
      telephone: u.telephone,
      estActif: u.estActif
    }));
  }

  async toggleStatus(id: number) {
    const user = await this.repository.findById(id);
    if (!user) throw new Error("Utilisateur introuvable");
    
    user.estActif = !user.estActif;
    await this.repository.create(user); // repository.create handles save
    
    console.log(`[Admin] Statut de l'utilisateur ${id} basculé à ${user.estActif}.`);
    return { success: true, estActif: user.estActif };
  }

  async deleteUser(id: number) {
    await this.repository.delete(id);
    return { success: true };
  }
}