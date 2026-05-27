import { Router } from "express";

import { AuthController }
from "../controller/auth.controller";

const router = Router();

const controller = new AuthController();

router.post(
  "/register",
  controller.register.bind(controller)
);

router.post(
  "/login",
  controller.login.bind(controller)
);

router.get(
  "/users",
  controller.getAllUsers.bind(controller)
);

router.put(
  "/users/:id/toggle-status",
  controller.toggleStatus.bind(controller)
);

router.delete(
  "/users/:id",
  controller.deleteUser.bind(controller)
);

export default router;