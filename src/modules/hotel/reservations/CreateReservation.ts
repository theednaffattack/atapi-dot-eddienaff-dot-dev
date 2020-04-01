import {
  Arg,
  ClassType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isWithinInterval } from "date-fns";

import { logger } from "../../middleware/logger";
import { isAuth } from "../../middleware/isAuth";
import { Hotel } from "../../../entity/Hotel";
import { Reservation } from "../../../entity/Reservation";
import { Room } from "../../../entity/Room";
import { User } from "../../../entity/User";

export function createBaseResolverToo<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  // entity: any,
) {
  @Resolver({ isAbstract: true })
  abstract class BaseCreateResolver {
    @UseMiddleware(isAuth, logger)
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(
      @Arg("data", () => inputType)
      data: any,
    ) {
      // I need a small factory or loop that will
      // dynamically access and save secondary repositories due
      // to db relations

      const isFromInRange = (data: any, reservation: any) =>
        isWithinInterval(data.dates.from, {
          start: reservation.from,
          end: reservation.to,
        });
      const isToInRange = (data: any, reservation: any) =>
        isWithinInterval(data.dates.to, {
          start: reservation.from,
          end: reservation.to,
        });

      const findTheHotel = await Hotel.findOne({
        relations: ["rooms", "rooms.reserved"],
        where: { id: data.hotelId },
      });

      let availableHotelRooms:
        | Room[]
        | "cannot find the hotel"
        | "no rooms available.";

      if (!findTheHotel) {
        availableHotelRooms = "cannot find the hotel";
      }

      if (findTheHotel && findTheHotel.rooms && findTheHotel.rooms.length > 1) {
        availableHotelRooms = findTheHotel.rooms.filter((room: Room) => {
          const resMappings: boolean[] = room.reserved.map(
            (reservation: Reservation) => {
              // we're returning a Boolean into the array
              // false = unavailable (reserved), true = available (no overlapping dates)
              return (
                !isFromInRange(data, reservation) &&
                !isToInRange(data, reservation)
              );
            },
          );

          // filter out rooms that have reservations that
          // overlap either of the requested reservation dates
          // seeking a more efficient solution than max looping
          // over every array
          return !resMappings.includes(false);
        });
      } else {
        availableHotelRooms = "no rooms available.";
      }

      const getRoom = await Room.findOne({
        where: {
          id:
            availableHotelRooms &&
            typeof availableHotelRooms !== "string" &&
            availableHotelRooms[0] &&
            availableHotelRooms[0].id
              ? availableHotelRooms[0].id
              : "",
        },
        relations: ["reserved"],
      });
      const getUser = await User.findOne({
        where: { id: data.userId },
      });

      const newReservation = await Reservation.create({
        from: data.dates.from,
        to: data.dates.to,
        user: getUser,
        room: getRoom,
      }).save();

      const existingReservations = getRoom ? getRoom.reserved : [];

      let updatedRoom;

      if (getRoom && existingReservations && existingReservations.length > 0) {
        getRoom.reserved = [...existingReservations, newReservation];
        updatedRoom = await getRoom.save();
        newReservation.room = updatedRoom;
      } else {
        throw Error("No reservations available!");
      }

      console.log(newReservation);

      return newReservation;

      // UP NEXT
      // grab a room from `availableHotelRooms` and create a reservation
      // return that reservation (signature below) to the graphql API

      // type Reservation {
      //   id: ID!
      //   from: DateTime!
      //   to: DateTime!
      //   user: User!
      //   room: Room!
      //   }
    }
  }

  return BaseCreateResolver;
}
