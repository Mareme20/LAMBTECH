import { Request, Response }
from "express";

import { PharmacieService }
from "../service/pharmacie.service";

export class PharmacieController {

  private service =
    new PharmacieService();

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

  async findNearby(
    req: Request,
    res: Response
  ) {

    const latitude =
      Number(req.query.latitude);

    const longitude =
      Number(req.query.longitude);

    const result =
      await this.service.findNearby(
        latitude,
        longitude
      );

    return res.json(result);
  }
}