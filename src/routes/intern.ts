import { Router } from "express";
import { createIntern, deleteIntern, getAllInterns, updateIntern } from "../controllers/intern";
import schemaValidator from "../middlewares/schemaValidator";
import { attachRepositoryMiddleware } from "../middlewares/attachRepository";
import { authentication, authorizePermission } from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";

const router=Router()
router.use(attachRepositoryMiddleware);
router.post('/auth/login',AuthController.login)
router.post('/',schemaValidator('/auth/intern/signup'),createIntern)
router.get('/',authentication,authorizePermission('read_intern'),getAllInterns)
router.put('/:id', schemaValidator('/auth/intern/update'),authentication, updateIntern);
router.delete('/delete/:id', deleteIntern);

export default router
