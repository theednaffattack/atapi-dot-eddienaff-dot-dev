import { InputType, Field, Int, ID } from "type-graphql";
import { Min, Max } from "class-validator";

// prettier-ignore
@InputType()
export class BaseUpdateInput {
  
  @Field(() => ID)
  id: string;

  
  @Field(() => Int, { description: "The number of stars from 1 - 5" })
  @Min(0)
  @Max(5)
  value = 0;
}
