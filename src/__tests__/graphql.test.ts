describe("Simple Math Test", () => {
  it("should return 4 when adding 2 + 2", () => {
    expect(2 + 2).toBe(4);
  });
});
// import request from 'supertest'
// import { app } from '..'
// import { users } from '../controllers/users'

// beforeEach(()=>{
//     users.length=0;
//     users.push(
//     { id: '1', name: 'John Doe', email: 'john@example.com',password:'Password123!' },
//     { id: '2', name: 'John Smith', email: 'jane@example.com',password:'Password123!' },
//     { id: '3', name: 'John Smith', email: 'johnsmith@example.com',password:'Password123!' },
//     { id: '3', name: 'Jane Smith', email: 'johnsmith@example.com',password:'Password123!' }

//     )
// })
// describe('Graphql resolvers', () => {
//     it('listusers - should return users with pagination',async()=>{
//         const query=`
//         query{
//         listusers(cursor:null,limit:2){
//         users{id
//         name
//         email
//         }

//         pageInfo{
//         endCursor
//         hasNextPage

//         }

//         }
//     }
//         `

//         const response=await request(app).post('/graphql').send({query})
//         expect(response.status).toBe(200)
//         expect(response.body.data.listusers.users.length).toBe(2);
//         expect(response.body.data.listusers.pageInfo.hasNextPage).toBe(true);

//     })

//     test('searchUsers - should return filtered users with pagination', async () => {
//         const query = `
//           query {
//             searchUsers(name: "John", email: null, cursor: null, limit: 2) {
//               users {
//                 id
//                 name
//                 email
//               }
//               pageInfo {
//                 endCursor
//                 hasNextPage
//               }
//             }
//           }
//         `;

//         const response = await request(app)
//           .post('/graphql')
//           .send({ query });

//           console.log('response is',response.body.data)

//         expect(response.status).toBe(200);
//         const filteredusers = response.body.data.searchUsers.users;
//         filteredusers.forEach((user: { name: string }) => {
//           expect(user.name).toContain('John');
//         });
//         expect(response.body.data.searchUsers.pageInfo.hasNextPage).toBe(true);
//       });

// })
