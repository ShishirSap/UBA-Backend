import { error } from "console";
import { DataSource } from "typeorm";
import dotenv from 'dotenv'
dotenv.config()

export const AppDataSource=new DataSource({
    type:'mysql',
    host:'localhost',
    port:3306,
    username:'root',
    password:process.env.dbpassword,
    database:'IMS',
    synchronize:false,
    logging:["query","error"],
    entities:["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
})