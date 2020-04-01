import { ObjectType, Field, ID } from "type-graphql";
import { User } from "../../entity/User";

// prettier-ignore
@ObjectType()
export class MessageSubType {
  
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  message: string;

  
  @Field(() => String)
  sentBy: string;

  
  @Field(() => User)
  user: User;

  
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

export interface MessagePayload {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  sentBy: string;
  user: User;
}
