import express, { NextFunction } from 'express'
import { Request,Response } from 'express'
import userRouter from './routes/users'
import { ApolloServer } from '@apollo/server'
import {expressMiddleware} from '@apollo/server/express4'
import cors from 'cors'
import bodyParser from 'body-parser'
import { typeDefs } from './graphql/schema'
import {resolvers} from './graphql/resolvers'


const app=express()
app.use(express.urlencoded({extended:false}))
import dotenv from 'dotenv'

dotenv.config()
const PORT=process.env.PORT

app.use('/api/users',userRouter)

app.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.send('hello world')
})
app.use(cors())
app.use(bodyParser.json())

const server = new ApolloServer({
   typeDefs,
   resolvers
})
async function serverstart(){
    await server.start()
    app.use('/graphql',expressMiddleware(server))
}
 serverstart()



app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`)
})

