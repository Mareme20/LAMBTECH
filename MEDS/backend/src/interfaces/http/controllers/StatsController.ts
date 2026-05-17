import { Request, Response } from "express";
import { StatsService } from "../../../utils/StatsService";

export class StatsController {
  private statsService = new StatsService();

  async getEpidemiology(req: Request, res: Response) {
    try {
      const stats = await this.statsService.getEpidemiologyStats();
      return res.json(stats);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
