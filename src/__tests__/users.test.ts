import { Request, Response, NextFunction } from 'express';
import { createUser,deleteUser,getAllUsers,getUser, updateUser, users } from '../controllers/users';
import schemaValidator from '../middlewares/schemaValidator';
import schemas from '../validator/schema';

describe('User CRUD Controller - createUser with validation', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        req = {
            method:'POST'
        };
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({
            json: mockJson,
        });

        res = {
            status: mockStatus,
            json: mockJson,
        } as Partial<Response>;

        next = jest.fn();

        users.length = 0; // Clear the users array before each test
    });

    describe('create', () => {


        test('Validator -should throw an error if schema not found', () => {
            expect(() => schemaValidator('/invalid/path')).toThrow('Schema not found for path: /invalid/path');
          });

        it('should create a new user with valid data', async () => {
            req.body = { name: 'John Doe', email: 'john@example.com', password: 'Password123!' };
    
            const validator = schemaValidator('/auth/signup', true);
            await validator(req as Request, res as Response, next);
    
            if (!mockStatus.mock.calls.length) {
                createUser(req as Request, res as Response);
            }
    
            expect(next).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                id: expect.any(String),
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Password123!',
            }));
            expect(users.length).toBe(1);
        });
    
        it('should not create a user with invalid email', async () => {
            req.body = { name: 'John Doe', email: 'john@example', password: 'Password123!' };
    
            const validator = schemaValidator('/auth/signup', true);
            await validator(req as Request, res as Response, next);
    
            expect(mockStatus).toHaveBeenCalledWith(422);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                status: 'failed',
                error: expect.objectContaining({
                    details: expect.any(Array)
                }),
            }));
            expect(users.length).toBe(0);
        });
    
        it('should not create a user  with invalid password',async()=>{
            req.body = { name: 'John Doe', email: 'john@example.com', password: 'Password123' };
    
            const validator = schemaValidator('/auth/signup', true);
            await validator(req as Request, res as Response, next);
            expect(mockStatus).toHaveBeenCalledWith(422)
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                status:'failed',
                error:expect.objectContaining({
                    details:expect.arrayContaining([expect.objectContaining({
                        message:expect.stringContaining('password with value Password123 fails to match the required pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})/'),
                        // type:expect.stringContaining('string.pattern.base')
                    })])
                })
            }))
            expect(users.length).toBe(0)
    
        })
    
        it('should not create a user with missing fields', async () => {
            req.body = { email: 'john@example.com', password: 'Password123!' };
    
            const validator = schemaValidator('/auth/signup', true);
            await validator(req as Request, res as Response, next);
    
            expect(mockStatus).toHaveBeenCalledWith(422);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                status: 'failed',
                error: expect.objectContaining({
                    details: expect.arrayContaining([expect.objectContaining({type:expect.stringContaining('any.required')})]),
                }),
            }));
            expect(users.length).toBe(0);
        });


    })
    
    
    
        describe('USER CRUD CONTROLLER- GET ALLUSERS', () => {
    
            it('should return all users',()=>{
                req.method='GET'
                users.push({id:'1',name:'John Doe',email:'john@gmail.com',password:'Password123!'})
                getAllUsers(req as Request,res as Response)
                expect(mockStatus).toHaveBeenCalledWith(200)
                expect(mockJson).toHaveBeenCalledWith(users)
            })
              
            })


            describe('getUser', () => {
                it('should return a user if found',()=>{
                    req.params={id:'1'}
                    users.push({id:'1',name:'John Doe',email:'john@example.com',password:'Password123!'})
                    getUser(req as Request,res as Response)
                    expect(mockJson).toHaveBeenCalledWith(users[0])
                })

                it('should return 404 if user is not found',()=>{
                    req.params={id:'1'}
                    getUser(req as Request,res as Response);
                    expect(mockStatus).toHaveBeenCalledWith(404)
                    expect(mockJson).toHaveBeenCalledWith({message:'User not found'})
                })
              
            })

            describe('Update User', () => {
                it('should update user if found',()=>{
                    req.params={id:'1'}
                    req.body={name:'Jane Doe'}
                    users.push({id:'1',name:'John Doe',email:'john@example.com',password:'Password123!'})
                    updateUser(req as Request,res as Response)
                    expect(users[0].name).toBe('Jane Doe')
                    expect(mockJson).toHaveBeenCalledWith({id:'1',name:'Jane Doe',email:'john@example.com',password:'Password123!'})
                })
                



                it('should return 404 if user not found',()=>{
                    req.params={id:'1'}
                    req.body={name:'Jane Doe'};
                    updateUser(req as Request,res as Response)
                    expect(mockStatus).toHaveBeenCalledWith(404)
                    expect(mockJson).toHaveBeenCalledWith({errors:'User not found'})
                })
              
            })

            describe('deleteUser', () => {
                it('should delete a user if found',()=>{
                    req.params={id:'1'}
                    users.push({id:'1',name:'Shishir',email:'shishir@gmail.com',password:'Password123!'})
                    deleteUser(req as Request,res as Response)
                    expect(users.length).toBe(0)
                    expect(mockJson).toHaveBeenCalledWith({message:'Shishir was successfully deleted'})
                    
                })

                it('should return 404 if user not found', () => {
                    req.params = { id: '1' };
            
                    deleteUser(req as Request, res as Response);
            
                    expect(mockStatus).toHaveBeenCalledWith(404);
                    expect(mockJson).toHaveBeenCalledWith({ message: 'User not found' });
                });
              
            })
            
   
    
      
    })