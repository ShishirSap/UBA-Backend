import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
// const {v4:uuidv4} =require('uuid')

import {v4 as uuidv4} from 'uuid'


const users:CreateUserDto[]=[]

export function getUsers(req:Request,res:Response){
    
res.send([])
}
export function getUsersById(req:Request,res:Response){
    res.send({})
}

export function createUser(req:Request<{},{},CreateUserDto>,res:Response){
  
const {name,email,id,password}=req.body;
const newUser:CreateUserDto={id:uuidv4(),name,email,password}

users.push(newUser)
res.status(201).json(newUser)



}