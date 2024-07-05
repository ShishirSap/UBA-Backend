import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
// const {v4:uuidv4} =require('uuid')

import {v4 as uuidv4} from 'uuid'

import authSignup from "../validator/schema";
import Joi from "joi";


export const users:CreateUserDto[]=[]



export function createUser(req:Request<{},{},CreateUserDto>,res:Response){

const {name,email,id,password}=req.body;
const newUser:CreateUserDto={id:uuidv4(),name,email,password}
users.push(newUser)
res.status(201).json(newUser)
 }




export function getAllUsers(req:Request,res:Response){
    res.status(200).json(users)
}

export const getUser = (req: Request, res: Response): void => {
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export const updateUser = (req: Request, res: Response): void => {

    const user = users.find(u => u.id === req.params.id);
    if(user){
        console.log(req.body)
        const {name,email,password}=req.body
        if(name) user.name=name
        if(email) user.email=email
        if(password) user.password=password

        res.json(user)
    }
    else{
        res.status(404).json({errors:'User not found'})
    }
    
};

export const deleteUser = (req: Request, res: Response): void => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex > -1) {
        const deletedUser = users.splice(userIndex, 1);
        res.json({
            message:`${deletedUser[0].name} was successfully deleted`
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};