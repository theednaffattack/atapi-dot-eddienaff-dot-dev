import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

import { IsEmailAlreadyExist } from "./is-email-already-exists";
import { PasswordInput } from "../../shared/password-input";

// prettier-ignore
@InputType()
export class RegisterInput extends PasswordInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;
}
