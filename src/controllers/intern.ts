import { Request,Response } from "express";
import { AppDataSource } from "../data-source";
import { Intern } from "../entity/intern";
const internRepository=AppDataSource.getRepository(Intern)
export const createIntern=async(req:Request,res:Response)=>{
    console.log('intern details are',req.body)
    const{firstName,lastName,email,phoneNumber,address,university,degree,major,yearOfStudy,resume,profilePicture,dateOfBirth,gender}=req.body


    try{
        const intern=new Intern();
        intern.firstName = firstName;
        intern.lastName = lastName;
        intern.email = email;
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
    catch(error){
        return res.status(500).json({error:'Error creating intern'})
    }

}