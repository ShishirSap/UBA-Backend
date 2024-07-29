import { Request,Response,NextFunction } from "express";
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
import { CreateInternDto } from "../dtos/createIntern.dto";
import { AppDataSource } from "../data-source";
import { Role } from "../entity/role";
import { UserRole } from "../entity/userrole";
import { RolePermission } from "../entity/rolepermission";


export interface CustomRequest extends Request{
    user?:any
    
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

export const authorizePermission=(requiredPermission:string)=>{
    console.log('the permission is',requiredPermission)
    return async(req:CustomRequest,res:Response,next:NextFunction)=>{
        const rolePermissionRepository=AppDataSource.getRepository(RolePermission)
        const userRolePermissions=await rolePermissionRepository.find({
            where:{
                role:
                {
                    name:req.user.userType
                }
            },
            relations:['permission'],
        })
        const userPermissions=userRolePermissions.map((rp)=>rp.permission.name)
        if(!userPermissions.includes(requiredPermission)){
            return res.status(403).json({message:'Forbidden'})
        }
        next()

    }
}

