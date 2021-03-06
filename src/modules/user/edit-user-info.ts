import { Arg, Resolver, Mutation, UseMiddleware, Ctx } from "type-graphql";

import { User } from "../../entity/User";
import { EditUserInput } from "./register/edit-user-input";
import { isAuth } from "../middleware/isAuth";
import { logger } from "../middleware/logger";
import { MyContext } from "../../types/MyContext";

const errorMessageBase = "Error saving info to database";

// prettier-ignore
@Resolver()
export class EditUserInfoResolver {
  @UseMiddleware(isAuth, logger)
  @Mutation(() => User)
  async editUserInfo(
    @Arg("data")
    {
      email,
      firstName,
      lastName,
    }: // // @ts-ignore
    // teamRoles,
    EditUserInput,
    @Ctx() ctx: MyContext,
  ): Promise<any> {
    // most efficient way to set records in the DB
    // returns nothing
    const setObject = {
      email,
      firstName,
      lastName,
    };

    await User.createQueryBuilder()
      .update(User)
      .set(setObject)
      .where("id = :id", { id: ctx.userId })
      .execute()
      .then(data => console.log("TYPICAL UPDATE", data))
      .catch(error => console.error(error));

    // since an error is thrown above on errors
    // it may be smarter to return the data passed in via
    // arguments rather than perform a lookup
    const userToReturn = await User.createQueryBuilder("user")
      .leftJoinAndSelect("user.teamRoles", "teamRoles")
      .where("user.id = :id", { id: ctx.userId })
      .getOne()
      .catch(error => {
        console.error(error);
        throw Error(`${errorMessageBase}\n${error}`);
      });

    return userToReturn;
  }
}
