import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

// const options = {
//   host: process.env.REDIS_HOST,
//   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   port: parseInt(process.env.REDIS_PORT_NUMBER!),
//   retryStrategy: (times: number): number => {
//     // reconnect after
//     return Math.min(times * 50, 2000);
//   },
// };

const options = {
  host:
    process.env.NODE_ENV === "production"
      ? process.env.REDIS_HOST
      : "localhost",
  port: 6379,
  retryStrategy: (times: number): number => {
    // reconnect after
    return Math.min(times * 50, 2000);
  },
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});
// export const pubsub = new RedisPubSub({
//   // ...,
//   publisher: new Redis(options),
//   subscriber: new Redis(options),
// });
