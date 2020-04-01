import {
  Resolver,
  Float,
  Query,
  FieldResolver,
  Root,
  Int,
  InputType,
  UseMiddleware,
  Arg,
  Field,
  ID,
} from "type-graphql";
// import { Min, Max } from "class-validator";
import { addDays } from "date-fns";

import { HotelInput } from "./HotelInput";
import { BaseListInput } from "./BaseListInput";
import { createBaseResolver } from "./BaseHotelResolver";
import { getBaseResolver } from "./BaseHotelGetAllResolver";

import { Hotel } from "../../entity/Hotel";
import { isAuth } from "../middleware/isAuth";
import { logger } from "../../modules/middleware/logger";
// import { Photo } from "../../entity/Photo";
// import { Review } from "../../entity/Review";

const BaseCreateHotelResolver = createBaseResolver(
  "Hotel",
  Hotel,
  HotelInput,
  Hotel,
  // Hotel
);

@InputType()
class PriceRangeInput {
  @Field(() => Int, { nullable: true })
  low: string;

  @Field(() => Int, { nullable: true })
  high: string;
}

// prettier-ignore
@InputType()
export class DateInputSimple {
  @Field(() => Date, { nullable: true })
  from: Date = new Date();

  @Field(() => Date, { nullable: true })
  to: Date = addDays(new Date(), 14);
}

// prettier-ignore
@InputType()
export class Amenity {
  @Field(() => String, { nullable: true })
  name: string[];
}

// prettier-ignore
@InputType()
export class GetAllHotelInput extends BaseListInput {
  @Field(() => DateInputSimple, { nullable: true })
  dates: object;

  @Field(() => Date, { nullable: true })
  from: Date;

  @Field(() => Date, { nullable: true })
  to: Date;

  @Field(() => PriceRangeInput, { nullable: true })
  prices: object;

  @Field(() => Amenity, {
    nullable: "itemsAndList",
  })
  amenities: string[];

  //
  // @Field(() => Int)
  // low: number;

  //
  // @Field(() => Int)
  // high: number;
}

const BaseGetAllHotelResolver = getBaseResolver(
  "Hotel",
  // Hotel,
  GetAllHotelInput,
  Hotel,
  Hotel,
  ["photos", "reviews", "rooms"],
);

// prettier-ignore
@InputType()
export class HotelGetInput {
  
  @Field(() => ID)
  hotelId: string;
}

// prettier-ignore
@Resolver(() => Hotel)
export class CreateHotelResolver extends BaseCreateHotelResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
}

// prettier-ignore
@Resolver(() => Hotel)
export class GetAllHotelResolver extends BaseGetAllHotelResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
}

// prettier-ignore
@Resolver(() => Hotel)
export class GetHotelResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }

  @UseMiddleware(isAuth, logger)
  @Query(() => Hotel, { name: "getHotelByID" })
  async getHotelByID(@Arg("data", () => HotelGetInput) data: HotelGetInput) {
    const hotelFound = await Hotel.findOne({
      where: { id: data.hotelId },
      relations: ["rooms"],
    });
    console.log("hotelFound");
    console.log(hotelFound);
    return hotelFound;
    // console.log(data);
  }
}

// prettier-ignore
@Resolver(() => Hotel)
export class HotelCountReviewsResolver extends BaseGetAllHotelResolver {
  @Query(() => Int)
  @FieldResolver(() => Int)
  
  async reviewCount(@Root() hotel: Hotel) {
    return hotel.reviews.length;
  }
}

// prettier-ignore
@Resolver(() => Hotel)
export class HotelAvgRatingResolver extends BaseGetAllHotelResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
  @Query(() => Float)
  @FieldResolver(() => Float)
  
  async averageRating(@Root() _hotel: Hotel) {
    const oneHotel = await Hotel.findOne({
      where: { id: "064ad970-37a4-4224-8956-360fe5e6a8f6" },
      relations: ["reviews"],
    });
    if (oneHotel) {
      console.log(oneHotel.reviews.length);

      
      const sum = function(_items: any[], prop: string): number {
        
        return oneHotel.reviews.reduce(function(
          accumulator: any,
          currentValue: any,
          // currentIndex
        ) {
          const makeANumber: any = currentValue[prop];

          const numberToReturn =
            parseFloat(accumulator) + parseFloat(makeANumber);

          return numberToReturn;
        }, 0);
        // Without this initial value `0` the reduce func breaks
      };

      const preliminaryAvgRating =
        sum(oneHotel.reviews, "value") / oneHotel.reviews.length;
      // console.log(sum(hotel.reviews, "value"));
      return Math.floor(preliminaryAvgRating * 10) / 10; // ? ratingsSum / hotel.reviews.length : null;
    }
    return 0.01;
  }
}
