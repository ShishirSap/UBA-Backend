import { Router } from "express";
import { createIntern, deleteIntern, getAllInterns, updateIntern } from "../controllers/intern";
import schemaValidator from "../middlewares/schemaValidator";
import { attachRepositoryMiddleware } from "../middlewares/attachRepository";
import { authentication } from "../middlewares/auth.middleware";

const router=Router()
router.use(attachRepositoryMiddleware);
router.post('/',schemaValidator('/auth/intern/signup'),createIntern)
router.get('/',authentication,getAllInterns)
router.put('/:id', schemaValidator('/auth/intern/update'), updateIntern);
router.delete('/delete/:id', deleteIntern);

export default router
