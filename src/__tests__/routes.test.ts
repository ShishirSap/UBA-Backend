
import request from "supertest";
import app from "..";
import { users } from "../controllers/users";
import { CreateUserDto } from "../dtos/CreateUser.dto";



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



})
