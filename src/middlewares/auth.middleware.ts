import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { CreateInternDto } from "../dtos/createIntern.dto";
import { AppDataSource } from "../data-source";
import { Role } from "../entity/role";
import { UserRole } from "../entity/userrole";
import { RolePermission } from "../entity/rolepermission";
import { In } from "typeorm";
import { mRolePermission, mUserRole } from "../models/mongoschema";

export interface CustomRequest extends Request {
  user?: any;
}
dotenv.config();
const { JWT_SECRET = "" } = process.env;

export const authentication = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decode = jwt.verify(token, JWT_SECRET);

    if (!decode) {
      console.log(decode);
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decode;
    console.log("The requester is", req.user);
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export const authorizePermission = (requiredPermission: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      // Fetch UserRoles from MongoDB based on intern ID
      const userRoles = await mUserRole.find({
        internId: req.user.id,
      });

      // Extract roleIds from userRoles
      const roleIds = userRoles.map((userRole) => userRole.roleId);

      // Fetch role permissions based on roleIds from MongoDB
      const rolePermissions = await mRolePermission
        .find({
          roleId: { $in: roleIds },
        })
        .populate("permissionId");

      // Extract permission names
      const userPermissions = rolePermissions.map((rp) => {
        const permission = rp.permissionId as any;
        return permission.name;
      });

      // Check if the user has the required permission
      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      console.error("Authorization error", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

// export const authorizePermission=(requiredPermission:string)=>{
//     return async(req:CustomRequest,res:Response,next:NextFunction)=>{
//         try{
//             const userRoleRepository=AppDataSource.getRepository(UserRole)
//             const rolePermissionRepository=AppDataSource.getRepository(RolePermission)
//             const userRoles=await userRoleRepository.find({
//                 where:{
//                     intern:{
//                         id:req.user.id
//                     }
//                 },
//                 relations:['roles']
//             })

//             const roleNames=userRoles.map((userRole)=>userRole.roles.name)
//             const userRolePermissions=await rolePermissionRepository.find({
//                 where:{
//                     role:{
//                         name:In(roleNames),
//                     }
//                 },
//                 relations:['permission']
//             })
//             const userPermissions=userRolePermissions.map((rp)=>rp.permission.name)
//             if(!userPermissions.includes(requiredPermission)){
//                 return res.status(403).json({message:'Forbidden'})
//             }
//             next()

//         }
//         catch(error){
//             console.error('Authorization error',error)
//             return res.status(500).json({message:'Internal Server Error'})
//         }

//     }
// }
