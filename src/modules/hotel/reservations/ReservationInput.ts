import { InputType, Field } from "type-graphql";
import { addDays } from "date-fns";
import { IsReservationAvailable } from "./isReservationAvailable";

// prettier-ignore
@InputType()
export class DateInput {
  
  @Field(() => Date)
  from: Date = new Date();

  
  @Field(() => Date)
  to: Date = addDays(new Date(), 14);

  
  @Field(() => String)
  hotelId: string;
}

// prettier-ignore
@InputType()
export class ReservationInput {
  
  @Field(() => DateInput)
  @IsReservationAvailable({
    message: "no reservations available during dates given",
  })
  dates: object;
  
  @Field(() => String)
  userId: string;

  
  @Field(() => String)
  hotelId: string;
}
