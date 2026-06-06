import { Router } from "express";
import { StatsController } from "../interfaces/http/controllers/StatsController";

const router = Router();
const controller = new StatsController();

router.get("/epidemiology", controller.getEpidemiology.bind(controller));
router.get("/alerts", controller.getAlerts.bind(controller));

export default router;
