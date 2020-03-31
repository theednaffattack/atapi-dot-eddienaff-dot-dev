import { Connection } from "typeorm";
import casual from "casual";
// import { inspect } from "util";

import { testConn } from "../../../test-utils/testConn";
import { gCall } from "../../../test-utils/gCall";
import { User } from "../../../entity/User";

let conn: Connection;

beforeAll(async done => {
  conn = await testConn();
  done();
});

afterAll(async done => {
  await conn.close();
  done();
});

const mockUser = {
  firstName: casual.first_name,
  lastName: casual.last_name,
  email: casual.email,
  password: casual.password,
};

// should be the exact same as mockUser
// minus the password field
const responseUser = {
  firstName: mockUser.firstName,
  lastName: mockUser.lastName,
  email: mockUser.email,
};

// const mockUser2 = {
//   firstName: "bob",
//   lastName: "bob",
//   email: "bob@bob.com",
//   password: "skdjfksajfdksajfkjaskdfj"
// };

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Register", () => {
  it("create user", async done => {
    // call resolver
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: mockUser,
      },
    });

    console.log("THE HELL IS GOING ON???", {
      response,
      mockUser,
      responseUser,
    });

    expect(response).toMatchObject({
      data: responseUser,
    });

    const dbUser = await User.findOne({ where: { email: mockUser.email } });

    // we should be able to find a user in the db
    expect(dbUser).toBeDefined();

    // that user SHOULD NOT be conifrmed yet
    expect(dbUser!.confirmed).toBeFalsy();

    // the user in the db should match our mocked up
    // data exactly
    expect(dbUser!.firstName).toBe(mockUser.firstName);
    expect(dbUser!.lastName).toBe(mockUser.lastName);

    done();
  });
});
