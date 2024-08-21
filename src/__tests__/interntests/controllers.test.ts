// import 'reflect-metadata'
// import { Request,Response } from "express"
// import { Intern } from "../../entity/intern"
// import { TestHelper } from "../dbInstanceHelper"
// import { createIntern, deleteIntern, getAllInterns, updateIntern } from "../../controllers/intern"
// import { Role } from "../../entity/role"
// import { UserRole } from "../../entity/userrole"
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { TestHelper } from "../dbInstanceHelper";
import mongoose from "mongoose";
import { Intern } from "../../entity/intern";
import { mRole } from "../../models/mongoschema";
import { app } from "../..";

let mongoServer: MongoMemoryServer;
let testHelper: TestHelper;
let internRepository: any;
let roleRepository: any;
let userRoleRepository: any;

beforeAll(async () => {
  testHelper = TestHelper.instance;
  await testHelper.setupTestDB();
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "test" });
});
afterAll(async () => {
  await testHelper.tearDownTestDB();
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = await mongoose.connection.db?.collections();
    if (collections) {
      for (const collection of collections) {
        await collection.deleteMany({});
      }
    }
  }
});
describe("role assignment", () => {
  test("should assign a role to an intern successfully", async () => {
    const internRepository = testHelper.getRepo(Intern);
    const intern = new Intern();
    intern.firstName = "John";
    intern.lastName = "Doe";
    intern.email = "johndd@email.com";
    intern.password = "Password@123!";
    await internRepository.save(intern);
    const role = (await mRole.create({ name: "admin" })).save();
    const response = await request(app)
      .post(`/api/roles/assign-role/${intern.id}`)
      .send({ name: "admin" })
      .expect(200);
    expect(response.body.message).toBe("Role assigned successfully");
    expect(response.body.intern.id).toBe(intern.id);
    expect(response.body.userRole).toBeDefined();
  });
});

//     describe('Create Intern', () => {
//         it('should create a new intern',async()=>{

//             const req = {
//                 body: {
//                     firstName: 'John',
//                     lastName: 'Doe',
//                     email: 'john.doe@example.com',
//                     phoneNumber: '1234567890',
//                     address: '123 Main St',
//                     university: 'Example University',
//                     degree: 'BSc',
//                     major: 'Computer Science',
//                     password: 'password123!',
//                     dateOfBirth: '1990-01-01',
//                     gender: 'M'
//                 },
//                 internRepository:testHelper.getRepo(Intern)

//             } as unknown as Request;

//             const res={
//                 status:jest.fn().mockReturnThis(),
//                 json:jest.fn()

//             } as unknown as Response

//             await createIntern(req,res)
//             expect(res.status).toHaveBeenCalledWith(201)
//             expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
//                 firstName:'John',
//                 lastName:'Doe',
//                 email:'john.doe@example.com'
//             }))

//         })

//     })

//     describe('Get All interns', () => {
//         it('should return all interns',async()=>{
//             const req={
//                 internRepository:internRepository
//             } as Request;
//             const res={
//                 status:jest.fn().mockReturnThis(),
//                 json:jest.fn()
//             } as unknown as Response

//             await getAllInterns(req,res)
//             expect(res.status).toHaveBeenCalledWith(200)
//             expect(res.json).toHaveBeenCalledWith(expect.any(Array))
//         })

//     })

//     describe('Update intern', () => {

//         it('should update an intern',async()=>{
//             const newIntern=internRepository.create({
//                 firstName: 'Jane',
//                 lastName: 'Doe',
//                 email: 'jane.doe@example.com',
//                 phoneNumber: '9876543210',
//                 address: '456 Main St',
//                 university: 'Another University',
//                 degree: 'Masters',
//                 major: 'Information Technology',
//                 password: 'Password123!',
//                 dateOfBirth: '1992-02-02',
//                 gender: 'F',
//                 userType:'intern'
//             })
//             await internRepository.save(newIntern)
//             const req={
//                 params:{id:newIntern.id.toString()},
//                 body:{firstName:'Janeupdated'},
//                 internRepository:internRepository,
//             } as unknown as Request

//             const res = {
//                 status: jest.fn().mockReturnThis(),
//                 json: jest.fn(),
//               } as unknown as Response;

//               await updateIntern(req, res);

//               expect(res.status).toHaveBeenCalledWith(200);
//               expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
//                 firstName: 'Janeupdated',

//               }));
//         })

//     })

//     describe('Delete intern', () => {

//         it('should delete an intern if found',async()=>{
//            const newIntern = internRepository.create({
//             firstName: 'Mark',
//             lastName: 'Smith',
//             email: 'mark.smith@example.com',
//             phoneNumber: '5551234567',
//             address: '789 Main St',
//             university: 'Test University',
//             degree: 'PhD',
//             major: 'Physics',
//             password: 'Password123!',
//             dateOfBirth: '1988-08-08',
//             gender: 'Male',
//             userType:'intern'
//           });
//           await internRepository.save(newIntern);

//           const req = {
//             params: { id: newIntern.id.toString() },
//             internRepository: internRepository
//           } as unknown as Request;

//           const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn(),
//           } as unknown as Response;

//           await deleteIntern(req, res);

//           expect(res.status).toHaveBeenCalledWith(200);
//           expect(res.json).toHaveBeenCalledWith({ message: 'Intern deleted successfully' });
//         });

//         })

// })
