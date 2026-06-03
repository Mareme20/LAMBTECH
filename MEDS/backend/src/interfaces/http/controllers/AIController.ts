import { Request, Response } from "express";
import { Repository } from "typeorm";
import { OCRService } from "../../../utils/OCRService";
import { ChatbotService } from "../../../utils/ChatbotService";
import { Medicament } from "../../../modules/medicament/entity/medicament.entity";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AIController {
  private ocrService: OCRService;
  private chatbotService = new ChatbotService();

  constructor(medicamentRepository: Repository<Medicament>) {
    this.ocrService = new OCRService(medicamentRepository);
  }

  async scanPrescription(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: "Aucune ordonnance n'a été téléchargée." });
    }

    try {
      const results = await this.ocrService.analyzePrescription(req.file.buffer);
      return res.json({ medicaments: results });
    } catch (error: any) {
      console.error("Erreur Scan:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async chat(req: Request, res: Response) {
    const { message, lang } = req.body;
    try {
      const response = await this.chatbotService.getResponse(message, lang || "FR");
      return res.json({ response });
    } catch (error: any) {
      console.error("Erreur Chat:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async getEpidemicAlerts(req: Request, res: Response) {
    try {
      // Chemin vers le fichier généré par le script Python
      const filePath = path.join(__dirname, "../../../../../ia/prediction/alertes_output_production.json");
      
      console.log("Recherche des alertes dans:", filePath);

      if (!fs.existsSync(filePath)) {
        return res.json({ 
          message: "Aucune alerte détectée pour le moment ou le moteur ML n'a pas encore tourné.",
          alertes: [] 
        });
      }

      const data = fs.readFileSync(filePath, "utf-8");
      const alertes = JSON.parse(data);
      
      return res.json({ 
        count: alertes.length,
        alertes 
      });
    } catch (error: any) {
      console.error("Erreur Alertes:", error);
      return res.status(500).json({ message: "Erreur lors de la récupération des alertes ML.", details: error.message });
    }
  }
}
