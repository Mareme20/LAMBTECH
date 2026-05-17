import { Router }
from "express";

import { CommandeController }
from "../controller/commande.controller";

import { authMiddleware }
from "../../../middlewares/auth.middleware";

const router = Router();

const controller =
  new CommandeController();

router.post(
  "/",
  authMiddleware,
  controller.create.bind(controller)
);

router.get(
  "/",
  authMiddleware,
  controller.findAll.bind(controller)
);

router.get(
  "/:id",
  authMiddleware,
  controller.findById.bind(controller)
);

router.put(
  "/:id/status",
  authMiddleware,
  controller.updateStatus.bind(controller)
);

export default router;