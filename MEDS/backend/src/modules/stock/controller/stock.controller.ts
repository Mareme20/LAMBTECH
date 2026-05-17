import { Request, Response }
from "express";

import { StockService }
from "../service/stock.service";

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
    req: Request,
    res: Response
  ) {

    const result =
      await this.service.findAll();

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