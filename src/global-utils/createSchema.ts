import { buildSchema } from "type-graphql";

import { pubsub } from "../global-utils/redis-config";

import { customAuthChecker } from "../modules/utils/custom-auth-checker";

import { ChangePasswordFromContextUseridResolver } from "../modules/user/ChangePasswordFromContextUserid";
import { ChangePasswordFromTokenResolver } from "../modules/user/ChangePasswordFromToken";
import { ConfirmUserResolver } from "../modules/user/ConfirmUser";
import { ForgotPasswordResolver } from "../modules/user/ForgotPassword";
import { LoginResolver } from "../modules/user/Login";
import { LogoutResolver } from "../modules/user/Logout";
import { MeResolver } from "../modules/user/Me";
import { RegisterResolver } from "../modules/user/Register";
import { CreateUserResolver } from "../modules/user/CreateUser";
import { ProfilePictureResolver } from "../modules/user/ProfilePictureUpload";
import { EditUserInfoResolver } from "../modules/user/edit-user-info";
import { AdminEditUserInfoResolver } from "../modules/user/admin/admin-edit-user-info";

// // IF WE WANT IMAGES...
import { SignS3 } from "../modules/aws-s3/s3-sign-mutation";
import { SignS3GetObject } from "../modules/aws-s3/s3-sign-mutation-get-object";
import { GraphQLSchema } from "graphql";

// // BELOW ARE MESSAGING / CHAT APP SPECIFIC RESOLVERS
// import { GetAllMessagesResolver } from "../modules/direct-messages/get-all-my-messages";
// import { GetListToCreateThread } from "../modules/direct-messages/get-list-to-create-thread";
// import { GetMyMessagesFromUserResolver } from "../modules/direct-messages/get-my-messages-from-user";
// import { UserTeamResolver } from "../modules/team/team-resolver";
// import { ChannelResolver } from "../modules/channel/channel-resolver";
// import { DirectMessageResolver } from "../modules/direct-messages/direct-messages-resolver";

export const createSchema = (): Promise<GraphQLSchema> =>
  buildSchema({
    // alphabetical please!
    resolvers: [
      // AddMessageToChannelResolver,
      AdminEditUserInfoResolver,
      ChangePasswordFromContextUseridResolver,
      ChangePasswordFromTokenResolver,
      ConfirmUserResolver,
      CreateUserResolver,
      EditUserInfoResolver,
      ForgotPasswordResolver,
      LoginResolver,
      LogoutResolver,
      MeResolver,
      ProfilePictureResolver,
      RegisterResolver,
      SignS3,
      SignS3GetObject,
    ],
    pubSub: pubsub,
    authChecker: customAuthChecker,
    dateScalarMode: "isoDate",
    // ({ context: { req } }) => {
    //   // I can read context here
    //   // check permission vs what's in the db "roles" argument
    //   // that comes from `@Authorized`, eg,. ["ADMIN", "MODERATOR"]
    //   return !!req.session.userId;
    // }
  });
