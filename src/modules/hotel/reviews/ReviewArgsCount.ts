import { Field, ArgsType } from "type-graphql";

// prettier-ignore
@ArgsType()
export class GetReviewsArgs {
  
  @Field(() => String)
  ID: string;
}
