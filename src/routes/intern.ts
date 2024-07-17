import { Router } from "express";
import { createIntern } from "../controllers/intern";
import schemaValidator from "../middlewares/schemaValidator";

const router=Router()
router.post('/',schemaValidator('/auth/intern/signup'),createIntern)

export default router
