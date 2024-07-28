import { NextFunction, Request,Response } from "express";
import { AppDataSource } from "../data-source";
import { Intern } from "../entity/intern";
import { QueryFailedError, Repository } from "typeorm";
import { encrypt } from "../helpers/helpers";
import { Role } from "../entity/role";
import { UserRole } from "../entity/userrole";

interface customRequest extends Request{
    internRepository?:Repository<Intern>
}
export const createIntern=async(req:customRequest,res:Response)=>{
    console.log('req.body is',req.body)
    
    const internRepository=req.internRepository as Repository<Intern>
    const roleRepository=AppDataSource.getRepository(Role)
    const userRoleRepository=AppDataSource.getRepository(UserRole)
    const{firstName,lastName,email,phoneNumber,address,university,degree,major,password,dateOfBirth,gender,userType}=req.body
    const encryptedPassword=await encrypt.encryptpass(password)


    try{
        const intern=new Intern();
        intern.firstName = firstName;
        intern.lastName = lastName;
        intern.email = email;
        intern.password=encryptedPassword;
        intern.phoneNumber = phoneNumber;
        intern.address = address;
        intern.university = university;
        intern.degree = degree;
        intern.major = major;
        intern.dateOfBirth = dateOfBirth;
        intern.gender = gender;
        intern.userType=userType
       
        await internRepository.save(intern)
      

        
        const token=encrypt.generateToken({id:intern.id,firstName:firstName,lastName:lastName,email:intern.email,userType:intern.userType})
        

        const role=await roleRepository.findOne({where:{name:`${intern.userType}`}})
        if(!role){
         return res.status(500).json({message:'No roles match the provided role'})
        }
        const userRole=new UserRole()
        userRole.intern=intern
        userRole.roles=role
        await userRoleRepository.save(userRole)
 
        
        

        return res.status(201).json({message:"user created successfully",intern,userRole,token})


    }
    catch(err:unknown){
        if(err instanceof QueryFailedError){
            const sqlError=err.driverError;
            if(sqlError.code==='ER_DUP_ENTRY'){
                return res.status(400).json({error:'Email already exists'})

            }
            return res.status(500).json({error:'An error occured while creating intern'})
        }

        else if(err instanceof Error){
            console.error('Error:',err.message)
            return res.status(500).json({error:'An unexpected error occured'})

        }
        else{
            console.error('Unknown error:',err)
            return res.status(500).json({error:'An unexpected error occured'})
        }
      
    }

    }



export const getAllInterns=async(req:customRequest,res:Response)=>{
    try{
        const internRepository=req.internRepository as Repository<Intern>
        const interns=await internRepository.find({})
        return res.status(200).json(interns)
    }
    catch(error){
        return res.status(500).json({error:'Error fetching interns'})
    }
}


export const updateIntern = async (req: customRequest, res: Response) => {
    const { id } = req.params;
    console.log('req for update is',req.body)
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        university,
        degree,
        major,
        dateOfBirth,
        gender,
        password
    } = req.body;
    

    try {
        const internRepository=req.internRepository as Repository<Intern>

        const intern = await internRepository.findOneBy({ id: parseInt(id, 10) });
        console.log('intern found to be updated is',intern)
        if (!intern) {
            return res.status(404).json({ error: 'Intern not found' });
        }
        console.log('before update intern.firstName is ',intern.firstName)

        intern.firstName = firstName || intern.firstName;
        intern.lastName = lastName || intern.lastName;
        intern.email = email || intern.email;
        intern.phoneNumber = phoneNumber || intern.phoneNumber;
        intern.address = address || intern.address;
        intern.university = university || intern.university;
        intern.degree = degree || intern.degree;
        intern.major = major || intern.major;  
        intern.dateOfBirth = dateOfBirth || intern.dateOfBirth;
        intern.gender = gender || intern.gender;
        intern.password = password || intern.password;
        console.log('after update intern.firstName is ',intern.firstName)



        await internRepository.save(intern);
        console.log(intern)
        return res.status(200).json(intern);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating intern' });
    }
};

export const deleteIntern = async (req: customRequest, res: Response) => {
    const { id } = req.params;

    try {
        const internRepository=req.internRepository as Repository<Intern>

        const intern = await internRepository.findOneBy({ id: parseInt(id, 10) });
        if (!intern) {
            return res.status(404).json({ error: 'Intern not found' });
        }

        await internRepository.remove(intern);
        return res.status(200).json({ message: 'Intern deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting intern' });
    }
};

