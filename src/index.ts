import "reflect-metadata";
import express, { NextFunction } from "express";
import { Request, Response } from "express";
import userRouter from "./routes/users";
import internRouter from "./routes/intern";
import rolesRouter from "./routes/role";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { interntypeDefs } from "./graphql/interns/schema";
import { internResolvers } from "./graphql/interns/resolvers";
import { usertypeDefs } from "./graphql/users/schema";
import { userResolvers } from "./graphql/users/resolvers";
import { mergeResolvers, mergeType, mergeTypeDefs } from "@graphql-tools/merge";
import { bulkindexing } from "./controllers/intern";
import { ConnectMongoDb } from "./connections/mongo.connection";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof Error) {
    const sanitizedError = {
      message: err.message,
      stack: err.stack,
    };
    res.status(500).json(sanitizedError);
  } else {
    res.status(500).json({ message: "An unknown error occurred" });
  }
});

dotenv.config();
const PORT = process.env.PORT;
ConnectMongoDb();

AppDataSource.initialize()
  .then(() => {
    console.log("Database connection successfull");
  })
  .catch((error) => console.log(error));

app.use("/api/users", userRouter);
app.use("/api/intern", internRouter);
app.use("/api/roles", rolesRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("hello world");
});

app.get("/elastic/indexbulk", bulkindexing);

const server = new ApolloServer({
  typeDefs: usertypeDefs,
  resolvers: userResolvers,
});
async function serverstart() {
  await server.start();
  app.use("/graphql", expressMiddleware(server));
}
serverstart();

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
  });
}

export { app, server };
