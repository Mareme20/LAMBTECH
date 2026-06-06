import { Request, Response } from "express";
import { StatsService } from "../../../utils/StatsService";
import * as fs from "fs";
import * as path from "path";

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

  async getAlerts(req: Request, res: Response) {
    try {
      const filePath = path.join(__dirname, "../../../../../ia/prediction/alertes_output_production.json");
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        const alerts = JSON.parse(data);
        return res.json({
          count: alerts.length,
          alertes: alerts.map((a: any) => ({
            maladie: a.nom_medicament + " (Hausse anormale)",
            description: a.message,
            niveau: a.niveau_alerte,
            zone: a.zone,
            date: a.date_detection
          }))
        });
      }
      return res.json({ count: 0, alertes: [] });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
