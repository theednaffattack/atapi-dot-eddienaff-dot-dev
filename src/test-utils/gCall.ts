import { graphql, GraphQLSchema } from "graphql";
import Maybe from "graphql/tsutils/Maybe";

import { createSchema } from "../global-utils/createSchema";

// prettier-ignore
interface Options {
  source: string;
  variableValues?: Maybe<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
  userId?: string;
}

let schema: GraphQLSchema;

export const gCall = async ({
  source,
  variableValues,
  userId,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
Options): Promise<any> => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql<Options>({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId,
        },
      },
      res: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clearCookie: (): jest.Mock<any, any> => jest.fn(),
      },
    },
  });
};
