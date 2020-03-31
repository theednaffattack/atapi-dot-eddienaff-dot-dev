/* eslint-disable no-console */
import { Arg, Resolver, Mutation, UseMiddleware, Ctx } from "type-graphql";

import { User, UserClassTypeWithReferenceIds } from "../../../entity/User";
import { EditUserInput } from "../register/edit-user-input";
import { isAuth } from "../../middleware/isAuth";
import { loggerMiddleware } from "../../middleware/logger";
import { MyContext } from "../../../types/MyContext";

const errorMessageBase = "Error saving info to database";

@Resolver()
export class AdminEditUserInfoResolver {
  @UseMiddleware(isAuth, loggerMiddleware)
  @Mutation(() => UserClassTypeWithReferenceIds)
  async adminEditUserInfo(
    @Arg("data") { email, firstName, lastName }: EditUserInput,
    @Ctx() ctx: MyContext,
  ): Promise<User> {
    // const myTeamId = `f1b8f931-8bcc-471d-b6c3-db67acfda29a`;
    let makeAUser: User;

    // most efficient way to set records in the DB
    // returns nothing
    const setBasicInfoObject = {
      email,
      firstName,
      lastName,
    };

    const getUser = await User.createQueryBuilder("user")
      .select()
      .leftJoinAndSelect("user.userToTeams", "userToTeams")
      .where("id = :id", { id: ctx.userId })
      .getMany()
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(`${error}`);
      });

    if (getUser && getUser.length > 1) {
      await User.createQueryBuilder()
        .update(User)
        .set(setBasicInfoObject)
        .where("id = :id", { id: ctx.userId })
        .execute()
        .then(data => console.log("ADMIN UPDATE", data))
        .catch(error => console.error(error));

      const userToReturn = await User.createQueryBuilder("user")
        .select()
        // .leftJoinAndSelect("user.userToTeams", "userToTeams")
        // .leftJoinAndSelect("userToTeams.team", "team")
        .where("user.id = :id", { id: ctx.userId })
        .getOne()
        .catch(error => {
          console.error(error);
          throw Error(`${errorMessageBase}\n${error}`);
        });

      makeAUser = Object.assign({}, userToReturn, {
        userToTeams: [],
      });

      console.log("USER TO RETURN OUTSIDE IF", {
        userToReturn: userToReturn,
      });
      return makeAUser;
    }
    throw Error("No User info to edit");
  }
}
