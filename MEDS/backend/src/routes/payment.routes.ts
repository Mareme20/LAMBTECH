import { Router } from "express";
import { PaymentController } from "../interfaces/http/controllers/PaymentController";

const router = Router();
const controller = new PaymentController();

router.post("/wave/webhook", controller.waveWebhook.bind(controller));

export default router;
