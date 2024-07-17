import { Router } from "express";
import { createIntern, getAllInterns } from "../controllers/intern";
import schemaValidator from "../middlewares/schemaValidator";

const router=Router()
router.post('/',schemaValidator('/auth/intern/signup'),createIntern)
router.get('/',getAllInterns)

export default router
