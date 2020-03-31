import { Resolver, Mutation, Arg } from "type-graphql";
import { v4 } from "uuid";

import { redis } from "../../redis";
import { User } from "../../entity/User";
import { sendPostmarkEmail } from "../utils/send-postmark-email";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";

// prettier-ignore
@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

let getHost;

      if(process.env.NODE_ENV === "production"){
        getHost = process.env.PRODUCTION_CLIENT_ORIGIN
      } else {
        getHost = process.env.DEVLEPMENT_CLIENT_URI
      }

    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1 day expiration

    await sendPostmarkEmail(
      email,
      `${getHost}/user/change-password/${token}`,
    );

    return true;
  }
}
