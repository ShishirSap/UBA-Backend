import { Router } from "express";
import RoleController from "../controllers/roles.controller";
import { addRole, assignRoleToIntern } from "../controllers/assignrole";
import {
  authentication,
  authorizePermission,
} from "../middlewares/auth.middleware";

const router = Router();

// Create a new role
router.post("/", RoleController.createRole);
router.post("/assign-role/:userId", addRole);

// Get all roles
router.get("/", RoleController.getAllRoles);

// Get a role by ID
// router.get("/:id", RoleController.getRoleById);

// // Delete a role by ID
// router.delete("/:id", RoleController.deleteRole);

export default router;
