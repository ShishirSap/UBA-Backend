import { users } from "../controllers/users";
import { paginate } from "./cursorpaginationhelper";

export const resolvers = {
    Query: {
      listusers: (_:any, args:{cursor?:string;limit?:number}) =>{
        const cursor=args.cursor||null
        const limit=args.limit||5
        const { items, pageInfo } = paginate(users, cursor, limit);

        return {
          users:items,
          pageInfo
        }
      },


      searchUsers: (_: any, args: { name?: string; email?: string; age?: number; cursor?: string; limit?: number }) => {
       const fileterdUsers=users.filter(user=>{
        return(
        (!args.name|| user.name.includes(args.name))&&
        (!args.email||user.email.includes(args.email))
        )
       })

       const cursor=args.cursor||null;
       const limit=args.limit||5

       const {items,pageInfo}=paginate(fileterdUsers,cursor,limit)
return{
  users:items,
  pageInfo,
}

      },
    },
  };
  
