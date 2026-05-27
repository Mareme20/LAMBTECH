import { GoogleGenAI } from '@google/genai';
import { Repository } from 'typeorm';
import { Medicament } from '../modules/medicament/entity/medicament.entity'; // Ajustez ce chemin selon votre projet

export class OCRService {
  private ai: GoogleGenAI;

  constructor(private readonly medicamentRepository: Repository<Medicament>) {
    // Initialisation standard par constructeur en lui transmettant explicitement la clé
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  async analyzePrescription(imageBuffer: Buffer) {
    console.log("[IA-OCR] Analyse intelligente de l'ordonnance via Gemini...");

    try {
      // 1. Récupérer le catalogue de médicaments de votre BD meds_db
      const dbMeds = await this.medicamentRepository.find({
        select: ['nomCommercial', 'molecule'],
      });

      // Transformer la liste en une chaîne de texte simple pour l'IA
      const availableMedsList = dbMeds
        .map(m => `- ${m.nomCommercial} (Molécule: ${m.molecule})`)
        .join('\n');

      // 2. Convertir le Buffer de l'image au format attendu par l'API Gemini
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/jpeg"
        },
      };

      // 3. Rédiger un "Prompt" ultra-précis (Instructions pour l'IA)
      const prompt = `
        Tu es un assistant pharmacien expert. Analyse cette image d'ordonnance médicale.
        
        Voici la liste stricte des médicaments disponibles dans notre base de données :
        ${availableMedsList}

        Instructions :
        1. Déchiffre l'écriture (même si elle est manuscrite ou mal lue).
        2. Identifie les médicaments prescrits.
        3. Pour CHAQUE médicament trouvé sur l'ordonnance, regarde s'il correspond ou ressemble fortement à un médicament de notre base de données ci-dessus (prends en compte les fautes de frappe ou les lectures déformées).
        4. Si un médicament de l'ordonnance correspond à notre base, extrait son "nom" exact (nomCommercial ou molécule) et tente de trouver son "dosage" (ex: 500mg, 1g, etc.). Si le dosage n'est pas écrit, mets "Dosage non spécifié".
        5. S'il n'y a STRICTEMENT AUCUN médicament correspondant à notre base de données sur cette image, renvoie un tableau vide.

        Tu DOIS répondre TOI-MÊME STRICTEMENT au format JSON suivant, sans texte avant ni après, sans balises markdown :
        [
          { "nom": "Nom du médicament de la BD", "dosage": "Le dosage trouvé" }
        ]
      `;

      // 4. Appel du modèle multimodal de Google via la méthode generateContent
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt, imagePart],
      });

      const responseText = response.text || '[]';
      console.log("[IA-OCR] Réponse brute de l'IA :", responseText);

      // Nettoyer la réponse au cas où l'IA aurait ajouté des balises markdown \`\`\`json
      const cleanJsonString = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      // 5. Analyser le JSON retourné par l'IA
      const results: { nom: string, dosage: string }[] = JSON.parse(cleanJsonString);

      // Si l'IA n'a rien trouvé ou si le tableau est vide
      if (!results || results.length === 0) {
        return [{ 
          nom: "Aucun médicament identifié", 
          dosage: "L'IA n'a trouvé aucune correspondance avec vos médicaments en base de données." 
        }];
      }

      // Dédoublonnage de sécurité
      return results.filter((v, i, a) => a.findIndex(t => t.nom === v.nom) === i);

    } catch (error: any) {
      console.error("Erreur lors de l'analyse intelligente de l'ordonnance :", error);
      return [{ 
        nom: "Erreur d'analyse IA", 
        dosage: "Impossible de déchiffrer l'image pour le moment." 
      }];
    }
  }
}
