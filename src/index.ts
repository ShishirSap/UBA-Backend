import express, { NextFunction } from 'express'
import { Request,Response } from 'express'
import userRouter from './routes/users'


const app=express()
app.use(express.urlencoded({extended:false}))
import dotenv from 'dotenv'

dotenv.config()
const PORT=process.env.PORT

app.use('/api/users',userRouter)

app.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.send('hello world')
})

app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`)
})

