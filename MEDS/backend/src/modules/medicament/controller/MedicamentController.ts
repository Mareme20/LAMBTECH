import { Request, Response } from "express";
import { MedicamentService } from "../service/MedicamentService";

export class MedicamentController {
  private service = new MedicamentService();

  async create(req: Request, res: Response) {
    const result = await this.service.create(req.body);

    return res.status(201).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.service.update(Number(id), req.body);

    return res.json(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.service.delete(Number(id));

    return res.status(204).send();
  }

  async findAll(req: Request, res: Response) {
    const result = await this.service.findAll();

    return res.json(result);
  }

  async searchPrescriptionNearby(req: Request, res: Response) {
    const { lat, lon, meds, rayon } = req.query;
    if (!lat || !lon || !meds) {
      return res.status(400).json({ 
        message: "Latitude, longitude et liste de médicaments (meds) sont requises." 
      });
    }

    const medsList = (meds as string).split(",");

    try {
      const result = await this.service.searchPrescriptionNearby(
        Number(lat),
        Number(lon),
        medsList,
        Number(rayon || 10)
      );

      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async searchNearby(req: Request, res: Response) {
    const { lat, lon, medicamentId, rayon, q } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ 
        message: "Latitude et longitude sont requises." 
      });
    }

    if (!medicamentId && !q) {
      return res.status(400).json({ 
        message: "ID du médicament ou terme de recherche 'q' est requis." 
      });
    }

    try {
      const result = await this.service.searchNearby(
        Number(lat),
        Number(lon),
        medicamentId ? Number(medicamentId) : undefined,
        Number(rayon || 10),
        q as string
      );

      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}