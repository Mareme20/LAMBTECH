export class OCRService {
  async analyzePrescription(imageBuffer: Buffer) {
    // Simulation réaliste pour le prototype (Tesseract.js pourrait être ajouté ici)
    console.log("[OCR] Analyse de l'ordonnance en cours...");
    
    // On simule une lecture réussie
    return [
      { nom: "Paracétamol", dosage: "500mg" },
      { nom: "Amoxicilline", dosage: "1g" }
    ];
  }
}
