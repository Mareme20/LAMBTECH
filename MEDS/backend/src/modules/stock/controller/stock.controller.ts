import { Request, Response }
from "express";

import { StockService }
from "../service/stock.service";

import { AuthRequest }
from "../../../middlewares/auth.middleware";

export class StockController {

  private service =
    new StockService();

  async create(
    req: Request,
    res: Response
  ) {

    try {

      const result =
        await this.service.create(req.body);

      return res.status(201).json(result);

    } catch (error: any) {

      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async updateQuantity(
    req: Request,
    res: Response
  ) {

    const pharmacieId =
      Number(req.params.pharmacieId);

    const medicamentId =
      Number(req.params.medicamentId);

    await this.service.updateQuantity(
      pharmacieId,
      medicamentId,
      req.body
    );

    return res.json({
      message: "Stock mis à jour",
    });
  }

  async findAll(
    req: AuthRequest,
    res: Response
  ) {
    // Si c'est un pharmacien, on force le filtrage par SA pharmacie
    // Si c'est un admin, pharmacieId sera undefined et il verra tout
    const pharmacieId = req.user?.role === 'PHARMACIE' ? req.user?.pharmacieId : undefined;

    // Sécurité supplémentaire : si pharmacien mais pas de pharmacieId lié, on ne renvoie rien
    if (req.user?.role === 'PHARMACIE' && !pharmacieId) {
      return res.json([]);
    }

    const result =
      await this.service.findAll(pharmacieId);

    return res.json(result);
  }

  async searchMedication(
    req: Request,
    res: Response
  ) {

    const medicationName =
      String(req.query.nom);

    const latitude =
      Number(req.query.latitude);

    const longitude =
      Number(req.query.longitude);

    const result =
      await this.service.searchMedication(
        medicationName,
        latitude,
        longitude
      );

    return res.json(result);
  }
}