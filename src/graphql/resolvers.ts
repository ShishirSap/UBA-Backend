import { users } from "../controllers/users";

export const resolvers = {
    Query: {
      listusers: (_:any, args:{cursor?:string;limit?:number}) =>{
        console.log('args are',args)
        const {cursor,limit=5}=args
        let startIndex=0;
        if(cursor){
          startIndex=users.findIndex(user=>user.id===cursor)+1
          console.log('startindex is ',startIndex)
        }

        const slicedUsers= users.slice(startIndex,startIndex+limit)
        console.log(slicedUsers)
        const endCursor=slicedUsers.length>0?slicedUsers[slicedUsers.length-1].id:null;
        console.log("endcursor",endCursor)

        return{
          users:slicedUsers,
          pageInfo:{
            endCursor,
            hasNextPage:startIndex+limit<users.length
          }
        }
      },













      searchUsers: (_: any, args: { name?: string; email?: string; age?: number }) => {
        return users.filter(user => {
          return (
            (!args.name || user.name.includes(args.name)) &&
            (!args.email || user.email.includes(args.email))
          );
        });
      },
    },
  };
  
