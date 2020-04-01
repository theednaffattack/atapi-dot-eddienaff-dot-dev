import { Field, InputType, Int } from "type-graphql";
import { Min, Max } from "class-validator";

// prettier-ignore
@InputType()
export class BaseListInput {
  
  @Field(() => Int)
  @Min(0)
  skip = 0;

  
  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  // 
  // @Field(() => Int)
  // @Min(1)
  // @Max(50)
  // low: string;

  // 
  // @Field(() => Int)
  // @Min(1)
  // @Max(50)
  // high: string;
}
