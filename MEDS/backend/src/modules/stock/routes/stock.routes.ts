import { Router }
from "express";

import { StockController }
from "../controller/stock.controller";

import { authMiddleware }
from "../../../middlewares/auth.middleware";

import { roleMiddleware }
from "../../../middlewares/role.middleware";

const router = Router();

const controller =
  new StockController();

router.post(
  "/",
  authMiddleware,
  roleMiddleware([
    "ADMIN",
    "PHARMACIE",
  ]),
  controller.create.bind(controller)
);

router.put(
  "/:pharmacieId/:medicamentId",
  authMiddleware,
  roleMiddleware([
    "ADMIN",
    "PHARMACIE",
  ]),
  controller.updateQuantity.bind(controller)
);

router.get(
  "/",
  controller.findAll.bind(controller)
);

router.get(
  "/search",
  controller.searchMedication.bind(controller)
);

export default router;