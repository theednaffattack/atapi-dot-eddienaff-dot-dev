// import { v4 } from "uuid";
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

export const createConfirmationUrl = async (
  userId: string,
): Promise<string> => {
  const clientDomain: string | undefined =
    process.env.NODE_ENV === "production"
      ? process.env.PRODUCTION_CLIENT_ORIGIN
      : process.env.DEVELOPMENT_CLIENT_URI;
  if (clientDomain) {
    await redis.set(confirmUserPrefix + userId, userId, "ex", 60 * 60 * 24); // 1 day expiration
    return `${clientDomain}/user/confirm/${userId}`;
  }
  throw `The client domain is undefined. Please set the environment variable: PRODUCTION_CLIENT_ORIGIN`;
};

// const token = v4();
