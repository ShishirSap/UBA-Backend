import { Router } from "express";
import { createUser, getUsers, getUsersById } from "../controllers/users";
const router=Router()

router.get("/",getUsers)

router.get("/:id",getUsersById)

router.post("/signup",createUser)

export default router