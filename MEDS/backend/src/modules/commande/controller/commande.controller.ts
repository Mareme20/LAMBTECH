import { Request, Response }
from "express";

import { CommandeService }
from "../service/commande.service";

export class CommandeController {

  private service =
    new CommandeService();

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

  async findAll(
    req: Request,
    res: Response
  ) {

    const result =
      await this.service.findAll();

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