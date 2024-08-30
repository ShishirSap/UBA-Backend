import { Router } from "express";
import {
  createIntern,
  deleteIntern,
  getAllInterns,
  getInternById,
  // searchelastic,
  searchInternsVulnerable,
  updateIntern,
} from "../controllers/intern";
import schemaValidator from "../middlewares/schemaValidator";
import { attachRepositoryMiddleware } from "../middlewares/attachRepository";
import {
  authentication,
  authorizePermission,
} from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";
import { verifyEmail } from "../controllers/email";

const router = Router();
router.use(attachRepositoryMiddleware);
router.get("/searchvulnerable", searchInternsVulnerable);
// router.get("/searchactual", searchelastic);
router.get("/verify-email", verifyEmail);
router.get("/:id", getInternById);
router.post("/auth/login", AuthController.login);
router.post("/", schemaValidator("/auth/intern/signup"), createIntern);
router.get(
  "/",
  authentication,
  authorizePermission("read_intern"),
  getAllInterns,
);
router.put(
  "/:id",
  schemaValidator("/auth/intern/update"),
  authentication,
  updateIntern,
);
router.delete("/delete/:id", deleteIntern);

export default router;
