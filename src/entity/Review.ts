import { ObjectType, Field, Float, ID } from "type-graphql";
import {
  ManyToOne,
  // OneToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from "typeorm";

import { User } from "./User";
import { Hotel } from "./Hotel";

// prettier-ignore
@ObjectType()
@Entity()
export class Review extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  
  @Field(() => Float)
  @Column("decimal", { precision: 2, scale: 1 })
  value: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  text: string;

  
  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.reviewLikes,
    { cascade: true },
  )
  likes: User;

  
  @Field(() => Date)
  @Column()
  date: Date;

  
  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.reviews,
    { cascade: true },
  )
  user: User;

  
  @Field(() => Hotel)
  @ManyToOne(
    () => Hotel,
    hotel => hotel.reviews,
    { cascade: true },
  )
  hotel: Hotel;
}
