import { Request,Response } from "express";
import { AppDataSource } from "../data-source";
import { Intern } from "../entity/intern";
import { QueryFailedError, Repository } from "typeorm";
export const createIntern=async(req:Request,res:Response)=>{
    console.log('Request from controller is',req)
    const internRepository=req.internRepository as Repository<Intern>
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
        const internRepository=req.internRepository as Repository<Intern>
        const interns=await internRepository.find({})
        return res.status(200).json(interns)
    }
    catch(error){
        return res.status(500).json({error:'Error fetching interns'})
    }
}


export const updateIntern = async (req: Request, res: Response) => {
    const { id } = req.params;
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
        if (!intern) {
            return res.status(404).json({ error: 'Intern not found' });
        }

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
        

        await internRepository.save(intern);
        return res.status(200).json(intern);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating intern' });
    }
};

export const deleteIntern = async (req: Request, res: Response) => {
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

