/** export class WaveService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.WAVE_API_KEY;
  }

  async createPaymentSession(amount: number, orderId: number) {
    if (!this.apiKey) {
      console.log(`[Wave Mock] Création d'une session de paiement pour la commande ${orderId} d'un montant de ${amount} FCFA.`);
      return {
        payment_url: `https://wave.com/pay/mock_${orderId}`,
        id: `wave_id_${Math.random().toString(36).substr(2, 9)}`,
      };
    }

    // Ici, l'implémentation réelle avec axios/fetch vers l'API Wave
    // return await axios.post('https://api.wave.com/v1/checkout/sessions', { ... });
    throw new Error("Intégration réelle Wave non configurée.");
  }

  async verifyWebhook(payload: any, signature: string) {
    if (!this.apiKey) {
      return true; // Simulation
    }
    // Logique de vérification de signature Wave
    return false;
  }
}
**/
import axios from 'axios';
import * as crypto from 'crypto';

export class WaveService {
  private apiKey: string | undefined;
  // Ajoutez cette variable dans votre .env si vous activez la vérification des signatures
  private webhookSecret: string | undefined; 

  constructor() {
    this.apiKey = process.env.WAVE_API_KEY;
    this.webhookSecret = process.env.WAVE_WEBHOOK_SECRET;
  }

  async createPaymentSession(amount: number, orderId: number) {
    // Mode Simulation (Si aucune clé API n'est configurée)
    if (!this.apiKey) {
      console.log(`[Wave Mock] Création d'une session de paiement pour la commande ${orderId} d'un montant de ${amount} FCFA.`);
      return {
        payment_url: `https://wave.com{orderId}`,
        id: `wave_id_${Math.random().toString(36).substring(2, 11)}`,
      };
    }

    // Mode Réel (Appel à l'API Wave Checkout)
    try {
      const response = await axios.post(
        'https://api.wave.com/v1/checkout/sessions',
        {
          amount: amount.toString(), // L'API attend le montant sous forme de chaîne
          currency: 'XOF',
          error_url: `https://votre-site.com{orderId}/cancel`,
          success_url: `https://votre-site.com{orderId}/success`,
          client_reference_id: orderId.toString(),
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        payment_url: response.data.wave_launch_url, // L'URL de redirection fournie par Wave
        id: response.data.id,
      };
    } catch (error: any) {
      console.error("Erreur lors de la création de la session Wave:", error.response?.data || error.message);
      throw new Error("Impossible d'initialiser le paiement avec Wave.");
    }
  }

  async verifyWebhook(payload: any, signatureHeader: string): Promise<boolean> {
    // Mode Simulation
    if (!this.apiKey) {
      console.log("[Wave Mock] Validation automatique du webhook.");
      return true; 
    }

    if (!this.webhookSecret || !signatureHeader) {
      return false;
    }

    try {
      // Découpage du header Wave-Signature (format attendu: t=timestamp,v1=signature)
      const parts = signatureHeader.split(',');
      const timestampPart = parts.find(p => p.startsWith('t='));
      const signaturePart = parts.find(p => p.startsWith('v1='));

      if (!timestampPart || !signaturePart) return false;

      const timestamp = timestampPart.split('=')[1] || '';
      const receivedSignature = signaturePart.split('=')[1] || '';

      // Reconstitution du payload signé : timestamp + corps brut de la requête
      const rawBody = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const signedPayload = timestamp + rawBody;

      // Calcul de la signature HMAC SHA256 locale
      const computedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(signedPayload)
        .digest('hex');

      // Vérification stricte (sécurisée contre les attaques temporelles)
      return crypto.timingSafeEqual(
        Buffer.from(computedSignature, 'utf-8'),
        Buffer.from(receivedSignature, 'utf-8')
      );
    } catch (err) {
      console.error("Échec de la vérification de la signature du webhook:", err);
      return false;
    }
  }
}
