export class WaveService {
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
