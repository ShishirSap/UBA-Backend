import { Router } from "express";
import { createUser, getUsers, getUsersById } from "../controllers/users";
import { validateRequest } from "../middlewares/validateRequest";
const router=Router()


router.get("/",getUsers)

router.get("/:id",getUsersById)

router.post("/signup",validateRequest(['name','email','password']),createUser)

export default router