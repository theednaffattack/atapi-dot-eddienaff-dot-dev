import { Arg, Resolver, Query, Mutation, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { loggerMiddleware } from "../middleware/logger";
import { sendPostmarkEmail } from "../utils/send-postmark-email";
import { createConfirmationUrl } from "../utils/create-confirmation-url";

// prettier-ignore
@Resolver()
export class RegisterResolver {
  @UseMiddleware(loggerMiddleware)
  @Query(() => String, { name: "helloWorld", nullable: false })
  async hello(): Promise<string> {
    return "Hello World";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { email, firstName, lastName, password }: RegisterInput,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    const seeResponse = await sendPostmarkEmail(email, await createConfirmationUrl(user.id));
    console.log("seeMailResponse", seeResponse)
    return user;
  }
}
