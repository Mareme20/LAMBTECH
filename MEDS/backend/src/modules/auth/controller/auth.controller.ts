import { Request, Response } from "express";

import { AuthService } from "../service/auth.service";

export class AuthController {
  private service = new AuthService();

  async register(req: Request, res: Response) {
    try {
      const result = await this.service.register(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      console.error("Erreur Inscription:", error);
      return res.status(400).json({
        message: error.message || "Erreur lors de l'inscription",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      console.log("[Auth] Requête de connexion reçue pour:", req.body.email);
      const result = await this.service.login(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("[Auth] Échec de connexion pour", req.body.email, ":", error.message);
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.service.getAllUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async toggleStatus(req: Request, res: Response) {
    try {
      const raw = req.params.id;
      const idStr = Array.isArray(raw) ? raw[0] : raw;
      const id = parseInt(String(idStr ?? "0"), 10);
      const result = await this.service.toggleStatus(id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const raw = req.params.id;
      const idStr = Array.isArray(raw) ? raw[0] : raw;
      const id = parseInt(String(idStr ?? "0"), 10);
      await this.service.deleteUser(id);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}