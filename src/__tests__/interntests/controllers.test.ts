import { Request,Response } from "express"
import { Intern } from "../../entity/intern"
import { TestHelper } from "../dbInstanceHelper"
import { createIntern } from "../../controllers/intern"


describe('Intern controller test', () => {
let testHelper:TestHelper
let internRepository:any;

    beforeAll(async()=>{
        testHelper=TestHelper.instance
        await testHelper.setupTestDB()
        internRepository=testHelper.getRepo(Intern)

    })
    afterAll(()=>{
        testHelper.tearDownTestDB()
    })


    describe('Create Intern', () => {
        it('should create a new intern',async()=>{

            const req = {
                body: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phoneNumber: '1234567890',
                    address: '123 Main St',
                    university: 'Example University',
                    degree: 'BSc',
                    major: 'Computer Science',
                    password: 'password123!',
                    dateOfBirth: '1990-01-01',
                    gender: 'M'
                },
                internRepository:testHelper.getRepo(Intern)
            } as unknown as Request;

            const res={
                status:jest.fn().mockReturnThis(),
                json:jest.fn()

            } as unknown as Response

            await createIntern(req,res)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                firstName:'John',
                lastName:'Doe',
                email:'john.doe@example.com'
            }))


        })
      
    })
    



  
})
