import { Router } from "express";
import { createIntern, deleteIntern, getAllInterns, updateIntern } from "../controllers/intern";
import schemaValidator from "../middlewares/schemaValidator";

const router=Router()
router.post('/',schemaValidator('/auth/intern/signup'),createIntern)
router.get('/',getAllInterns)
router.put('/:id', schemaValidator('/auth/intern/update'), updateIntern);
router.delete('/delete/:id', deleteIntern);

export default router
