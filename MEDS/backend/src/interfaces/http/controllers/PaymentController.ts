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

    const event = req.body;
    
    // Détection du succès de paiement de la session Wave Checkout
    if (event && event.type === "checkout.session.completed") {
      const orderId = Number(event.data.client_reference_id);

      if (orderId) {
        console.log(`[Webhook Wave] Paiement confirmé pour la commande n°${orderId}`);

        try {
          // CORRECTION : On appelle la bonne méthode existante et on passe le format DTO attendu
          await this.commandeService.updateStatus(orderId, { statut: "PAYEE" as any });
          
          return res.json({ received: true });
        } catch (error) {
          console.error("[Webhook Wave] Échec de la mise à jour du statut :", error);
        }
      }
    }

    return res.json({ received: true });
  }
}
