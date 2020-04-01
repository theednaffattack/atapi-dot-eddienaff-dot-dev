import { Field, ObjectType, ArgsType, InputType } from "type-graphql";

// prettier-ignore
@ArgsType()
export class MessageInput {

  @Field(() => String)
  sentBy: string;

  @Field(() => String)
  message: string;
}

// prettier-ignore
@InputType()
export class GetMessagesInput {

  @Field(() => String)
  sentBy: string;

  @Field(() => String)
  user: string;
}

// prettier-ignore
@ObjectType()
export class MessageOutput {
  @Field() message: string;
}
