import { request } from 'graphql-request';

import { User } from '../../../entity/User';
import { createTypeormConn } from '../../../utils/createTypeormConn';

import {
  userCreation,
  valid_email,
  valid_password,
  usersQuery,
  userQuery
} from '../queries/queries';

import { Connection } from 'typeorm';

let conn: Connection;

beforeAll(async () => {
 conn = await createTypeormConn();
})

afterAll(async () => {
  conn.close();
});

describe("User management", () => {
  it("can query users", async () => {
    await request(
      process.env.TEST_HOST as string,
      userCreation(valid_email, valid_password)
    );

    const response: any = await request(
      process.env.TEST_HOST as string,
      usersQuery()
    );

    expect(response.users).toHaveLength(1);
  });

  it("can query specific user", async () => {
    const actualUsers = await User.find({ where: { valid_email }});
    expect(actualUsers).toHaveLength(1);

    const user = actualUsers[0];
    const response: any = await request(
      process.env.TEST_HOST as string,
      userQuery(user.id)
    );

    expect(response.user.email).toEqual(valid_email);
  })
});
