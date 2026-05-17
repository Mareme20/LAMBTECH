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

    const user = {
      ...data,
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
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return {
      token,
      utilisateur: {
        id: user.id,
        nom: user.nomComplet,
        email: user.email,
        role: user.role,
      },
    };
  }
}