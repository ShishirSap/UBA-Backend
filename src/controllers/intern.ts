import { Request,Response } from "express";
import { AppDataSource } from "../data-source";
import { Intern } from "../entity/intern";
import { QueryFailedError } from "typeorm";
const internRepository=AppDataSource.getRepository(Intern)
export const createIntern=async(req:Request,res:Response)=>{
    const{firstName,lastName,email,phoneNumber,address,university,degree,major,password,dateOfBirth,gender}=req.body


    try{
        const intern=new Intern();
        intern.firstName = firstName;
        intern.lastName = lastName;
        intern.email = email;
        intern.password=password;
        intern.phoneNumber = phoneNumber;
        intern.address = address;
        intern.university = university;
        intern.degree = degree;
        intern.major = major;
        intern.dateOfBirth = dateOfBirth;
        intern.gender = gender;
        await internRepository.save(intern)
        return res.status(201).json(intern)


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



export const getAllInterns=async(req:Request,res:Response)=>{
    try{
        const interns=await internRepository.find({})
        return res.status(200).json(interns)
    }
    catch(error){
        return res.status(500).json({error:'Error fetching interns'})
    }
}