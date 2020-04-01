import { Min, Max } from "class-validator";
import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class GetReviewsArgs {
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field({ nullable: true })
  title?: string;

  // helpers - index calculations
  startIndex = this.skip;
  endIndex = this.skip + this.take;
}
