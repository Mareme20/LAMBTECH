import { Request, Response } from "express";
import { OCRService } from "../../../utils/OCRService";
import { ChatbotService } from "../../../utils/ChatbotService";

export class AIController {
  private ocrService = new OCRService();
  private chatbotService = new ChatbotService();

  async scanPrescription(req: Request, res: Response) {
    // Dans une version réelle, on utiliserait multer pour req.file
    try {
      const results = await this.ocrService.analyzePrescription(Buffer.from(""));
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
