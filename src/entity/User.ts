import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType, Root } from "type-graphql";

import { Image } from "./Image";
import { Message } from "./Message";
import { Reservation } from "./Reservation";
import { Review } from "./Review";

/**
 * User Entity (model)
 * @param {string} User.id - The ID of a User
 * @param {string} User.firstName - The given name of a User
 * @param {string} User.lastName - The family name (surname) of a User
 */

// prettier-ignore
@ObjectType()
@Entity()
export class User extends BaseEntity {
  /**id field */
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ nullable: true })
  @Column()
  firstName: string;

  @Field({ nullable: true })
  @Column()
  lastName: string;

  @Field({ nullable: true })
  @Column("text", { unique: true })
  email: string;

  @Field(() => [Message], { nullable: true })
  @OneToMany(
    () => Message,
    message => message.user,
  )
  messages: Message[];


  
  @OneToMany(() => Reservation, reservation => reservation.user)
  reservations: Reservation[];

  
  @Field(() => Review, { nullable: true })
  @OneToMany(() => Review, review => review.likes)
  reviewLikes?: [];

  
  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, review => review.user)
  reviews?: Review[];


  @Field(() => [User], { nullable: "itemsAndList" })
  // eslint-disable-next-line prettier/prettier
  @ManyToMany(
    () => User,
    user => user.following,
    { nullable: true },
  )
  @JoinTable()
  followers: User[];

  @Field(() => [User], { nullable: "itemsAndList" })
  @ManyToMany(
    () => User,
    user => user.followers,
    { nullable: true },
  )
  following: User[];

  @Field({ nullable: true })
  @Column("text", { unique: true, nullable: true })
  profileImageUri: string;

  @Field({ nullable: true })
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column() password: string;

  @Column("bool", { default: false })
  confirmed: boolean;

  @Field(() => [Image])
  @OneToMany(
    () => Image,
    image => image.user,
  )
  images: Image[];
}

// prettier-ignore
@ObjectType()
export class UserClassTypeWithReferenceIds {
  /**id field */
  @Field(() => ID, { nullable: true })
  id: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  email: string;

  @Field(() => [Message], { nullable: true })
  messages: Message[];


  @Field(() => [Reservation], { nullable: true })
  reservations: Reservation[];

  
  @Field(() => Review, { nullable: true })
  reviewLikes?: [];

  
  @Field(() => [Review], { nullable: true })
  reviews?: Review[];


  @Field(() => [User], { nullable: "itemsAndList" })
  followers: User[];

  @Field(() => [User], { nullable: "itemsAndList" })
  following: User[];

  @Field({ nullable: true })
  profileImageUri: string;

  @Field({ nullable: true })
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column() password: string;

  @Column("bool", { default: false })
  confirmed: boolean;
}
