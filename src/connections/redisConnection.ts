import { createClient } from "redis";

export const getRedisClient = async () => {
  const redisclient = await createClient()
    .on("error", (err) => console.log("Redis client error", err))
    .connect();

  return redisclient;
};
