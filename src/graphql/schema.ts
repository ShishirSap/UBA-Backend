
import { users } from "../controllers/users"

export const typeDefs=`
type User{
id:String!
name:String!
email:String!
}

type Query{
listusers:[User!]!
}

`

export const resolvers={
    Query:{
        listusers:()=>users
    }
}