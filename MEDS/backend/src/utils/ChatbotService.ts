import { GoogleGenAI } from '@google/genai';

export class ChatbotService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialisation du SDK avec la clé API stockée dans votre fichier .env
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  async getResponse(message: string, lang: "FR" | "WOLOF" | string) {
    console.log(`[Chatbot] Analyse de la question en langue : ${lang}`);

    try {
      // Construction d'un prompt système strict pour guider le comportement de l'IA
      const systemInstruction = `
        Tu es "MedsAI", un assistant virtuel de santé sénégalais ultra-compétent, chaleureux et bienveillant.
        Ta mission est de conseiller et d'orienter les utilisateurs sur leurs symptômes ou leurs médicaments.

        Règles strictes :
        1. Tu dois obligatoirement formuler ta réponse dans la langue demandée : ${lang === 'WOLOF' ? 'WOLOF sénégalais authentique (script romain standard)' : 'Français chaleureux'}.
        2. Adapte tes conseils au contexte médical, culturel et de santé du Sénégal (ex: mentionner le paracétamol de manière accessible, orienter vers une pharmacie de garde ou une structure locale).
        3. Donne des conseils de premier secours ou d'hygiène clairs, courts et faciles à comprendre.
        4. RAPPEL DE SÉCURITÉ CRITIQUE : Termine TOUJOURS ta réponse par une phrase courte rappelant l'importance de consulter un médecin ou un pharmacien si les symptômes persistent, car tu n'es qu'une IA.
      `;

      // Appel au modèle de discussion textuelle rapide de Google
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nVoici la question de l'utilisateur : "${message}"` }] }
        ],
      });

      // Retourne la réponse générée par l'IA ou un message de secours si vide
      return response.text || (lang === "WOLOF" 
        ? "Baal ma, mënuluma tontu ci loolu léegi." 
        : "Désolé, je ne peux pas répondre à cette question pour le moment.");

    } catch (error) {
      console.error("Erreur lors de la génération de la réponse du Chatbot :", error);
      
      // Fallback amical en cas de coupure réseau ou problème d'API
      return lang === "WOLOF"
        ? "Am nañu jafé-jafé ak réseaux bi. Baal ma, tontul ma la léegi."
        : "Une erreur technique s'est produite. Je ne peux pas vous répondre pour le moment.";
    }
  }
}
