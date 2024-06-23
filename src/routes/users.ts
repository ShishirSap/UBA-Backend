import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/users";
import { validateRequest } from "../middlewares/validateRequest";
const router=Router()


router.get("/",getAllUsers)

router.get("/:id",getAllUsers)

router.post("/signup",validateRequest(['name','email','password']),createUser)

export default router