import { Request, Response } from "express";

import { AuthService } from "../service/auth.service";

export class AuthController {
  private service = new AuthService();

  async register(req: Request, res: Response) {
    try {

      const result =
        await this.service.register(req.body);

      return res.status(201).json({
        message: "Utilisateur créé",
        data: result,
      });

    } catch (error: any) {

      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {

      const result =
        await this.service.login(req.body);

      return res.status(200).json(result);

    } catch (error: any) {

      return res.status(400).json({
        message: error.message,
      });
    }
  }
}