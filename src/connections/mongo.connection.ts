import mongoose from "mongoose";

export const ConnectMongoDb = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/authorization")
    .then(() => {
      console.log("mongodb connected");
    })
    .catch((error) => {
      console.log("Mongodb connection error", error);
    });
};
