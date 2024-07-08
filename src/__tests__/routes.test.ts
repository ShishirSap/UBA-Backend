
import request from "supertest";
import {app} from "..";
import { users } from "../controllers/users";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import Test from "supertest/lib/test";



describe('User routes', () => {

    beforeEach(()=>{
        users.length=0;
    })

    it('GET /api/users --should return empty array when no users',async()=>{
        const res=await request(app).get('/api/users')
        expect(res.status).toBe(200)
        expect(res.body).toStrictEqual([])
    })
    it('should return users if users are present',async()=>{
        const newUser:CreateUserDto={
            id:'1',
            name:'shishir',
            email:'shishir@g.com',
            password:'Password123'
        }
        users.push(newUser)
        const res=await request(app).get('/api/users')
        expect(res.status).toBe(200)
        expect(res.body).toStrictEqual(expect.arrayContaining(users))
    })


    it('POST /api/users/signup - should create a new user', async () => {
        const newuser = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password1!',
        };
    
        const res = await request(app).post('/api/users/signup').send(newuser);
    
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
          name: newuser.name,
          email: newuser.email,
        });
        expect(res.body).toHaveProperty('id');
        expect(users).toHaveLength(1);
      });
    

      it('POST /api/users/signup - should not create a user with invalid email', async () => {
        const newUser = {
          name: 'John Doe',
          email: 'invalid-email',
          password: 'Password1!',
        };
    
        const res = await request(app).post('/api/users/signup').send(newUser);
    
        expect(res.status).toBe(422);
        expect(res.body).toHaveProperty('status', 'failed');
      });
      it('GET /api/users/:id - should return a specific user', async () => {
        const newUser = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password1!',
        };
        users.push(newUser);
    
        const res = await request(app).get('/api/users/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(newUser);
      });
    
      it('PUT /api/users/:id - should update a user', async () => {
        const newUser = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password1!',
        };
        users.push(newUser);
    
        const updatedData = {
          name: 'John Updated',
          email: 'john.updated@example.com',
          password: 'Updated1!',
        };
    
        const res = await request(app).put('/api/users/1').send(updatedData);
    
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(updatedData);
        expect(users[0]).toMatchObject(updatedData);
      });
    

      it('PUT /api/users/:id - shouldnot update user with invalid email',async()=>{
        const newUser = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password1!',
        };
        users.push(newUser);
        const updatedData={
          email:'John@@2'
        }
        const res=await request(app).put('/api/users/1').send(updatedData)
        expect(res.status).toBe(422)
        
      })
      it('DELETE /api/users/:id - should delete a user', async () => {
        const newUser = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password1!',
        };
        users.push(newUser);
    
        const res = await request(app).delete('/api/users/1');
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(expect.objectContaining({message:'John Doe was successfully deleted'}))
        expect(users).toHaveLength(0);
      });

      describe('Extra routes', () => {
        test('GET /api/users/timeout/simulate - should return 504 Gateway Timeout', async () => {
          const res = await request(app).get('/api/users/timeout/simulate');
          
          expect(res.status).toBe(504);
          expect(res.text).toBe('Gateway Timeout');
        },10000);
      
        test('All methods except get on /api/users/ - should return 405 Method Not Allowed', async () => {
      
          const methods :{[key:string]:(url:string)=>Test}={
            post:request(app).post,
            put:request(app).put,
            patch:request(app).patch,
            delete:request(app).delete,

          }

          for(const method in methods){
            const res=await methods[method]('/api/users')
            expect(res.status).toBe(405)
            expect(res.text).toBe('Method Not Allowed')
          }

          
      
        
        });
      });



})


