import { Router }
from "express";

import { PharmacieController }
from "../controller/pharmacie.controller";

import { authMiddleware }
from "../../../middlewares/auth.middleware";

import { roleMiddleware }
from "../../../middlewares/role.middleware";

const router = Router();

const controller =
  new PharmacieController();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  controller.create.bind(controller)
);

router.get(
  "/",
  controller.findAll.bind(controller)
);

router.get(
  "/nearby",
  controller.findNearby.bind(controller)
);

export default router;