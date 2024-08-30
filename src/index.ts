import "reflect-metadata";
import express, { NextFunction } from "express";
import { Request, Response } from "express";
import userRouter from "./routes/users";
import internRouter from "./routes/intern";
import rolesRouter from "./routes/role";
import permissionsRouter from "./routes/permissions";
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
import { createClient } from "redis";
import {
  authentication,
  authorizePermission,
} from "./middlewares/auth.middleware";
import amqplib from "amqplib";
const app = express();

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const queue = "hello";

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to RabbitMQ
let channel: amqplib.Channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });
    console.log(`Connected to RabbitMQ and queue ${queue} is ready.`);
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
}

// Start RabbitMQ connection
connectRabbitMQ();

// Consumer to process messages
async function startConsuming() {
  if (!channel) {
    console.log("what");
    return;
  }

  console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

  channel.consume(
    queue,
    (msg) => {
      if (msg) {
        console.log("hello world");
        console.log(`Received ${msg.content.toString()}`);
      }
    },
    { noAck: true },
  );
}

// Start RabbitMQ consumer
startConsuming();

app.post("/send", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    if (channel) {
      channel.sendToQueue(queue, Buffer.from(message));
      console.log(`Sent '${message}' to ${queue}`);
      startConsuming();
      res.status(200).json({ status: "Message sent" });
    } else {
      res.status(500).json({ error: "Failed to connect to RabbitMQ" });
    }
  } catch (error) {
    console.error("Error sending message", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// connectRedis()
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
// ConnectMongoDb();

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Database connection successfull");
//   })
//   .catch((error) => console.log(error));

app.use("/api/users", userRouter);
app.use("/api/intern", internRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/permissions", permissionsRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("hello world");
});

app.get("/elastic/indexbulk", bulkindexing);

const server = new ApolloServer({
  typeDefs: interntypeDefs,
  resolvers: internResolvers,
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
