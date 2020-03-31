import { Arg, Resolver, Mutation } from "type-graphql";

import { redis } from "../../redis";
import { User } from "../../entity/User";
import { confirmUserPrefix } from "../constants/redisPrefixes";

// prettier-ignore
@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(
    @Arg("token") token: string,
    // @Ctx() ctx: MyContext
  ): Promise<boolean> {
    console.log("CONFIRM USER!!!");
    const userId = await redis.get(confirmUserPrefix + token);
    console.log("OH WAIT!!!",{userId});

    if (!userId) {
      return false;
    }

    // update the user to be confirmed and ditch the token from redis
    // @todo: prefix ALL redis tokens for readability
    const userUpdateResponse = await User.update({ id: userId }, { confirmed: true }).catch(error=>console.error(error));
    // await redis.del(token);
    console.log("USER UPDATED",{userUpdateResponse});

    const redisResponse = await redis.del(confirmUserPrefix + token);

    console.log("UPDATES TO DB'S",{userUpdateResponse, redisResponse});

    return true;
  }
}
