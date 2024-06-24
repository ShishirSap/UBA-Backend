import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/users";
import { validateRequest } from "../middlewares/validateRequest";
const router=Router()


router.get("/",getAllUsers)

router.get("/:id",getUser)

router.put('/:id',validateRequest(['name','email','password'],false),updateUser)

router.post("/signup",validateRequest(['name','email','password'],true),createUser)

router.delete('/:id',deleteUser);

export default router