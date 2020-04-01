import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Between } from "typeorm";
import { isWithinInterval } from "date-fns";

// import { Reservation } from "../../../entity/Reservation";
import { DateInput } from "./ReservationInput";
import { Room } from "../../../entity/Room";

// TypeORM Query Operators
export const AfterDate = (fromTo: DateInput) => Between(fromTo.from, fromTo.to);
export const BeforeDate = (fromTo: DateInput) =>
  Between(fromTo.from, fromTo.to);

// prettier-ignore
@ValidatorConstraint({ async: true })
export class IsReservationAvailableConstraint implements ValidatorConstraintInterface {
  async validate(_datesInput: DateInput) {
    // I need to find a way to tell if any room in the hotel at all
    // has availability
    const theRoom = await Room.find({
      relations: ["hotel", "reserved", "reserved.room"],
      where: { hotel: _datesInput.hotelId },
    })
      .then(data =>
        data.map(item => {
          return item && item.reserved
            ? item.reserved.filter(reservation => {
                return (
                  !isWithinInterval(_datesInput.from, {
                    start: reservation.from,
                    end: reservation.to,
                  }) &&
                  !isWithinInterval(_datesInput.to, {
                    start: reservation.from,
                    end: reservation.to,
                  })
                );
              })[0]
            : [];
        }),
      )
      .catch(error => console.error(error));

    return theRoom && theRoom.length > 0 ? true : false;
  }
}

export function IsReservationAvailable(validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsReservationAvailableConstraint,
    });
  };
}
