import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Room } from "./Room";
import { User } from "./User";

// prettier-ignore
@ObjectType("Reservation", { description: "The reservation model" })
@Entity()
export class Reservation extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;


  @Field(() => Date)
  @Column()
  from: Date;


  @Field(() => Date)
  @Column()
  to: Date;


  @Field(() => User)

  @ManyToOne(
    () => User,
    user => user.reservations,
  )
  user: User;


  @Field(() => Room)

  @ManyToOne(
    () => Room,
    room => room.reserved,
    { cascade: true },
  )
  room: Room;
}
