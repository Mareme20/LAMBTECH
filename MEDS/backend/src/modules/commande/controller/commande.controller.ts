import { Request, Response }
from "express";

import { CommandeService }
from "../service/commande.service";

import { AuthRequest }
from "../../../middlewares/auth.middleware";

export class CommandeController {

  private service =
    new CommandeService();

  async create(
    req: AuthRequest,
    res: Response
  ) {

    try {
      const patientId = req.user?.id;
      if (!patientId) {
        return res.status(401).json({ message: "Utilisateur non identifié" });
      }

      // On s'assure que le patientId de la commande est celui de l'utilisateur connecté
      const data = {
        ...req.body,
        patientId
      };

      const result =
        await this.service.create(data);

      return res.status(201).json(result);

    } catch (error: any) {
      console.error("Erreur création commande:", error);
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async findAll(
    req: AuthRequest,
    res: Response
  ) {
    const pharmacieId = req.user?.role === 'PHARMACIE' ? req.user?.pharmacieId : undefined;
    const patientId = req.user?.role === 'PATIENT' ? req.user?.id : undefined;
    const livreurId = req.user?.role === 'LIVREUR' ? req.user?.id : undefined;

    const result =
      await this.service.findAll(pharmacieId, patientId, livreurId);

    return res.json(result);
  }

  async findById(
    req: Request,
    res: Response
  ) {

    const id =
      Number(req.params.id);

    const result =
      await this.service.findById(id);

    return res.json(result);
  }

  async updateStatus(
    req: Request,
    res: Response
  ) {

    const id =
      Number(req.params.id);

    await this.service.updateStatus(
      id,
      req.body
    );

    return res.json({
      message: "Statut mis à jour",
    });
  }
}