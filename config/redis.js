import { createClient } from "redis";

export const client = createClient({
  url: process.env.REDIS_URI,
});

const connectRedis = (client) => async () => {
  client.on("ready", () => {
    console.log("Redis instance ready...".black.bgBlue);
  });

  client.on("error", (err) =>
    console.error("Redis Client Error".black.bgRed, err)
  );

  await client.connect();
};

export default connectRedis(client);
