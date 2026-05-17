import { Router } from "express";
import { AIController } from "../interfaces/http/controllers/AIController";

const router = Router();
const controller = new AIController();

router.post("/scan", controller.scanPrescription.bind(controller));
router.post("/chat", controller.chat.bind(controller));

export default router;
