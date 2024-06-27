import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/users";
// import { validateRequest } from "../middlewares/validateRequest";
import schemaValidator from "../middlewares/schemaValidator";
const router=Router()


router.get("/",getAllUsers)

router.get("/:id",getUser)

router.put('/:id', schemaValidator('/auth/update'),updateUser)

router.post("/signup",schemaValidator('/auth/signup'), createUser)

router.delete('/:id',deleteUser);

export default router