import { Router } from "express";
import { MedicamentController } from "../controller/MedicamentController";

const router = Router();

const controller = new MedicamentController();

router.post("/", controller.create.bind(controller));
router.get("/", controller.findAll.bind(controller));
router.get("/nearby", controller.searchNearby.bind(controller));

export default router;