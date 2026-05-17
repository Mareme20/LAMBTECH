import { Request, Response } from "express";
import { MedicamentService } from "../service/MedicamentService";

export class MedicamentController {
  private service = new MedicamentService();

  async create(req: Request, res: Response) {
    const result = await this.service.create(req.body);

    return res.status(201).json(result);
  }

  async findAll(req: Request, res: Response) {
    const result = await this.service.findAll();

    return res.json(result);
  }

  async searchNearby(req: Request, res: Response) {
    const { lat, lon, medicamentId, rayon } = req.query;

    if (!lat || !lon || !medicamentId) {
      return res.status(400).json({ 
        message: "Latitude, longitude et ID du médicament sont requis." 
      });
    }

    try {
      const result = await this.service.searchNearby(
        Number(lat),
        Number(lon),
        Number(medicamentId),
        Number(rayon || 10)
      );

      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}