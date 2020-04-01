import { InputType, Field, Float, ID } from "type-graphql";

// prettier-ignore
@InputType()
export class BaseReviewInput {
  
  @Field(() => Float)
  value: number;

  
  @Field(() => String)
  title: string;

  
  @Field(() => String)
  text: string;

  
  @Field(() => ID)
  hotelId: string;

  
  @Field(() => ID)
  userId: string;

  
  @Field(() => Date, { defaultValue: Date.now() })
  date: Date;
}
