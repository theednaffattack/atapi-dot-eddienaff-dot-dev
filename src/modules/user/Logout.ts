import { Resolver, Mutation, Ctx, UseMiddleware } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { logger } from "../middleware/logger";

// prettier-ignore
@Resolver()
export class LogoutResolver {
  @UseMiddleware(logger)
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return ctx.req.session!.destroy(err => {
        if (err) {
          console.error(err);
          return reject(false);
        }
        ctx.res.clearCookie("atg");

        return resolve(true);
      });
    });
  }
}
