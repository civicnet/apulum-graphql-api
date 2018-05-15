import { Connection } from 'typeorm';
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { User } from '../../../entity/User';
import * as casual from 'casual';

import { TestClient } from '../../../utils/TestClient';

let conn: Connection;
let email = casual.email;
let password = casual.password;
let userId: string;

beforeAll(async() => {
  conn = await createTypeormConn();
  const user = await User.create({
    email: email,
    password: password,
    confirmed: true,
  }).save();
  userId = user.id;
})

afterAll(async () => {
  conn.close();
});

describe('Logout test', () => {
  test("Test logging in and out", async () => {
    const client = new TestClient(
      process.env.TEST_HOST as string
    );
    await client.login(email, password);

    const response = await client.me();
    expect (response.data).toEqual({
      me: {
        id: userId,
        email
      }
    });

    await client.logout();
    const noMe = await client.me();
    expect (noMe.data.me).toBeNull();
  });
});
