import { Router } from "express";
import { MedicamentController } from "../controller/MedicamentController";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { roleMiddleware } from "../../../middlewares/role.middleware";

const router = Router();

const controller = new MedicamentController();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "PHARMACIE"]),
  controller.create.bind(controller)
);

router.get("/", controller.findAll.bind(controller));
router.get("/nearby", controller.searchNearby.bind(controller));
router.get("/nearby-prescription", controller.searchPrescriptionNearby.bind(controller));

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  controller.update.bind(controller)
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "PHARMACIE"]),
  controller.delete.bind(controller)
);

export default router;