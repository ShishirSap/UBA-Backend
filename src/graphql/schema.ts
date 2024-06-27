
import { users } from "../controllers/users"

export const typeDefs=`
type User{
id:String!
name:String!
email:String!
}

type Query{
listusers:[User!]!,
searchUsers(name:String,email:String):[User!]!
}

`