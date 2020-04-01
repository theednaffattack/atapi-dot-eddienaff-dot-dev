import {
  Mutation,
  Publisher,
  PubSub,
  Subscription,
  Root,
  Args,
  Resolver,
  Ctx,
} from "type-graphql";

import { MessageInput } from "./message-input";
import { Message } from "../../entity/Message";
import { User } from "../../entity/User";
import { MessageSubType, MessagePayload } from "./message.type";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class MessageResolver {
  @Subscription(() => MessageSubType, {
    topics: ({ context }) => {
      if (!context.userId) {
        throw new Error("not authed");
      }
      return "MESSAGES";
    },

    filter: () => {
      return true;
    },
    // filter: ({ payload, args }) => args.priorities.includes(payload.priority),
  })
  newMessage(
    @Root() messagePayload: MessagePayload,
    // @Args(() => MessageInput)
    // input: MessageInput,
  ): MessageSubType {
    return {
      ...messagePayload,
      createdAt: new Date(),
    };
  }

  @Mutation(() => Boolean)
  async addNewMessage(
    @Ctx() context: MyContext,
    @PubSub("MESSAGES") publish: Publisher<MessagePayload>,
    @Args(() => MessageInput)
    input: MessageInput,
  ): Promise<boolean> {
    // Promise<boolean>
    if (!context) {
      console.log("THIS IS AN ERROR!");
      console.log(context);
      throw new Error("not authed");
    }

    const receiver = await User.findOne({
      where: {
        id: context.userId,
      },
    });

    const fullMessageInput = {
      createdAt: new Date(),
      updatedAt: new Date(),
      message: input.message,
      sentBy: input.sentBy, // (Jamey.Cassin@Eloise.org: Aisha Stanton) //SENDING User,
      user: receiver, // (Reinger_Keaton@yahoo.com: Candelario Johnson) THE USER BEING SENT TO
    };

    const newMessage = await Message.create(fullMessageInput).save();

    console.log(newMessage);
    // here we can trigger subscriptions topics
    await publish(newMessage);

    // this should return a boolean? Not sure if that's just the example
    // best practice
    // return true;
    return true;
  }
}
