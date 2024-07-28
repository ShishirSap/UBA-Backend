import { Request,Response,NextFunction } from "express";
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
import { CreateInternDto } from "../dtos/createIntern.dto";


export interface CustomRequest extends Request{
    user?:unknown
    
}
dotenv.config()
const {JWT_SECRET=""}=process.env

export const authentication=(
    req:CustomRequest,
    res:Response,
    next:NextFunction
)=>{
    const header=req.headers.authorization
    if(!header){
        return res.status(401).json({message:"Unauthorized"})
    }
    const token=header.split(" ")[1]
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
        
    }
    try{
    const decode=jwt.verify(token,JWT_SECRET)

    if (!decode) {
        console.log(decode)
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user=decode
      console.log('The requester is',req.user)
      next()}
      catch(err){
        return res.status(403).json({error:'Invalid token'})
      }
     
    

}