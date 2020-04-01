import { Resolver, Query, Arg, Ctx } from "type-graphql";

import { Message } from "../../entity/Message";
import { GetMessagesInput } from "./message-input";
import { MyContext } from "../../types/MyContext";

// prettier-ignore
@Resolver()
export class GetMyMessagesResolver {
  @Query(() => [Message], { nullable: true })
  async getMyMessages(
    @Ctx() context: MyContext,
    @Arg("input", () => GetMessagesInput) input: GetMessagesInput
  ): Promise<Message[]> {
    const newMessages: Message[] = await Message.find({
      where: { userId: context.userId, sentBy: input.sentBy }
    });

    // const groupedMessages = await Message.createQueryBuilder("message")
    //   .where('"sentBy" = :sentBy', { sentBy: input.sentBy })
    //   .groupBy('"sentBy"')
    //   .addGroupBy("id")
    //   .getMany();
      
    return newMessages;
  }
}
