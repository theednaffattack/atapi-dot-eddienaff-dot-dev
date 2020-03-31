import { ObjectType, Field, ID } from "type-graphql";
import {
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from "typeorm";

import { User } from "./User";

export interface MessagePayload {
  id: number;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
  sentBy?: string;
  user?: User;
}

// prettier-ignore
@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Date)
  @Column()
  createdAt: Date;

  @Field(() => Date)
  @Column()
  updatedAt: Date;

  @Field()
  @Column()
  message: string;

  @Field(() => ID)
  @Column({ nullable: true })
  sentBy: string;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.messages,
    { cascade: true },
  )
  user: User;
}
