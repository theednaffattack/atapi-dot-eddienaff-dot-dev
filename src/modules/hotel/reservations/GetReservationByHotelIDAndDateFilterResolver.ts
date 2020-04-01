import { Query, Resolver, UseMiddleware, Arg } from "type-graphql";
import { isWithinInterval } from "date-fns";

import { logger } from "../../middleware/logger";
import { isAuth } from "../../middleware/isAuth";
import { Reservation } from "../../../entity/Reservation";
import { Room } from "../../../entity/Room";
import { ReservationInput } from "./ReservationInput";

// prettier-ignore
@Resolver()
export class GetReservationByHotelIDAndDateFilterResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => [Reservation], {
    name: `getAllReservationsByHotelIDAndDateFilter`,
    nullable: "itemsAndList",
  })
  async getAllReservationsByHotelIDAndDateFilter(
    @Arg("data", () => ReservationInput)
    data: any,
  ) {
    const theRoom = await Room.find({
      relations: ["hotel", "reserved", "reserved.room"],
      where: { hotel: data.hotelId },
    })
      .then(roomData =>
        roomData.map(item => {
          return item && item.reserved
            ? item.reserved.filter(reservation => {
                console.log(data.dates.from.toISOString());
                console.log(data.dates.to.toISOString());
                console.log(
                  isWithinInterval(
                    reservation.from,{start:
                    data.dates.from.toISOString(),
                    end: data.dates.to.toISOString(),}
                  ),
                );
                console.log(
                  isWithinInterval(reservation.to, {
                    start: data.dates.from.toISOString(),
                    end: data.dates.to.toISOString()
                  }),
                );
                return (
                  isWithinInterval(
                    reservation.to, {
                    start: data.dates.from.toISOString(),
                    end: data.dates.to.toISOString()
                  }) ||
                  isWithinInterval(
                    reservation.from, {
                    start: data.dates.from.toISOString(),
                    end: data.dates.to.toISOString()
                  })
                );
              })[0]
            : [];
        }),
      )
      .catch(error => console.error(error));
    return theRoom ? theRoom : ["error: no room list detected"];
  }
}
