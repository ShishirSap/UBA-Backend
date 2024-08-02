import { Request,Response } from "express";
import { AppDataSource } from "../data-source";
import { Intern } from "../entity/intern";
import { encrypt } from "../helpers/helpers";
import { UserRole } from "../entity/userrole";

export class AuthController{
    static async login(req:Request,res:Response){
        console.log('Request is',req)
        try{
            const {email,password}=req.body
            if(!email||!password){
                return res.status(500).json({message:'email and password are required'})

            }

            const internRepository=AppDataSource.getRepository(Intern)
            const intern=await internRepository.findOne({where:{email},relations:['userRoles','userRoles.roles','userRoles.roles.rolePermissions','userRoles.roles.rolePermissions.permission']})
            if(!intern){
                return res.status(404).json({message:'No intern with provided email found'})
            }
            const isPasswordValid=encrypt.comparepassword(intern.password,password)
            if(!isPasswordValid){
                return res.status(404).json({message:'Password is wrong'})
            }
            const token=encrypt.generateToken({id:intern.id,firstName:intern.firstName,lastName:intern.lastName,email:intern.email,userType:intern.userType})
            const roles=intern.userRoles.map(userRole=>userRole.roles.name)
            const permissions=intern.userRoles.reduce((acc,userRole)=>{
                return acc.concat(userRole.roles.rolePermissions.map(rp=>rp.permission.name))
            },[] as string[])
            return res.status(200).json({message:'Login successfull', intern: {
                id: intern.id,
                firstName: intern.firstName,
                lastName: intern.lastName,
                email: intern.email,
                userType: intern.userType,
                roles,
                permissions
              },
              token
            })

        }
        catch(error){
            console.error(error)
            return res.status(500).json({message:'internal server error'})
        }
    }
   
}