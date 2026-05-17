export class ChatbotService {
  async getResponse(message: string, lang: "FR" | "WOLOF") {
    const prompt = lang === "WOLOF" 
      ? "Réponds en Wolof comme un assistant santé sénégalais : "
      : "Réponds en Français comme un assistant santé sénégalais : ";
    
    // Simulation d'une réponse IA
    if (message.toLowerCase().includes("maux de tête") || message.toLowerCase().includes("bopp buy metti")) {
      return lang === "WOLOF" 
        ? "Sama waay, loolu paracetamool laa lay digal. Waaye demal gisee ak dobtéer bi."
        : "Cher ami, pour des maux de tête, je vous conseille du paracétamol. Mais veuillez consulter un médecin.";
    }

    return lang === "WOLOF"
      ? "Baal ma, mënuluma tontu ci loolu léegi."
      : "Désolé, je ne peux pas répondre à cette question pour le moment.";
  }
}
