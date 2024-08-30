import { Router } from "express";
import {
  createpermissions,
  getAllPermissions,
} from "../controllers/permission.controller";
import { authentication } from "../middlewares/auth.middleware";

const router = Router();
router.post("/", createpermissions);
router.get("/", getAllPermissions);

export default router;
