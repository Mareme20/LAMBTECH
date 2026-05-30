import { Router } from "express";
import multer from "multer";
import { AppDataSource } from "../database/data-source"; // Ajustez le chemin vers votre DataSource TypeORM
import { Medicament } from "../modules/medicament/entity/medicament.entity"; // Ajustez le chemin de votre entité
import { AIController } from "../interfaces/http/controllers/AIController";

const router = Router();

// 1. Récupération du repository TypeORM depuis la DataSource globale
const medicamentRepository = AppDataSource.getRepository(Medicament);

// 2. Injection du repository directement dans le contrôleur
const controller = new AIController(medicamentRepository);

// Configuration de multer pour stocker l'image en mémoire
const upload = multer({ storage: multer.memoryStorage() });

router.post("/scan", upload.single("prescription"), controller.scanPrescription.bind(controller));
router.post("/chat", controller.chat.bind(controller));
router.get("/alerts", controller.getEpidemicAlerts.bind(controller));

export default router;
