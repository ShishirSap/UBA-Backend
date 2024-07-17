


export const typeDefs=`
type User{
id:String!
name:String!
email:String!
}

type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
}

type UserConnection{
users:[User!]!
pageInfo:PageInfo!
}


type Query{
listusers(cursor:String,limit:Int):UserConnection!
searchUsers(name:String,email:String,cursor:String,limit:Int):UserConnection!
}

`