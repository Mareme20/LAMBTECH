import { Request, Response } from "express";
import { WaveService } from "../../../utils/WaveService";
import { CommandeService } from "../../../modules/commande/service/commande.service";

export class PaymentController {
  private waveService = new WaveService();
  private commandeService = new CommandeService();

  async waveWebhook(req: Request, res: Response) {
    const signature = req.headers["wave-signature"] as string;
    
    const isValid = await this.waveService.verifyWebhook(req.body, signature);

    if (!isValid) {
      return res.status(401).json({ message: "Signature invalide" });
    }

    // Dans une intégration réelle, on extrairait l'ID de la commande du payload Wave
    const { order_id } = req.body;

    if (order_id) {
      await this.commandeService.updateStatus(Number(order_id), { statut: "payée" } as any);
    }

    return res.json({ received: true });
  }
}
