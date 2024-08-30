import { createClient } from "redis";

export const getRedisClient = async () => {
  const redisclient = await createClient()
  //   {
  //   socket:{
  //     host:'redis',
  //     port:6379
  //   }
  // }
    .on("error", (err) => console.log("Redis client error", err))
    .connect();

  return redisclient;
};
