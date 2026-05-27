import { Request, Response } from "express";
import { Repository } from "typeorm";
import { OCRService } from "../../../utils/OCRService";
import { ChatbotService } from "../../../utils/ChatbotService";
import { Medicament } from "../../../modules/medicament/entity/medicament.entity"; // Ajustez le chemin vers votre entité

export class AIController {
  private ocrService: OCRService;
  private chatbotService = new ChatbotService();

  // Le constructeur reçoit le repository TypeORM injecté depuis les routes
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
      return res.status(500).json({ message: error.message });
    }
  }

  async chat(req: Request, res: Response) {
    const { message, lang } = req.body;
    try {
      const response = await this.chatbotService.getResponse(message, lang || "FR");
      return res.json({ response });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
