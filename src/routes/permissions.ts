import { Router } from "express";
import {
  createpermissions,
  getAllPermissions,
} from "../controllers/permission.controller";

const router = Router();
router.post("/", createpermissions);
router.get("/", getAllPermissions);

export default router;
