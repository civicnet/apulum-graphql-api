import { Connection } from 'typeorm';
import { User } from '../../../entity/User';
import * as casual from 'casual';

import { TestClient } from '../../../utils/TestClient';
import { createTypeormConn } from '../../../utils/createTypeormConn';

let conn: Connection;
const email = casual.email;
const password = casual.password;
let userId: string;

beforeAll(async() => {
  conn = await createTypeormConn();
  const user = await User.create({
    email,
    password,
    confirmed: true,
  }).save();
  userId = user.id;
})

afterAll(async () => {
  conn.close();
});

describe('Logout test', () => {
  test("Multiple sessions logging in and out", async() => {
    const client1 = new TestClient(process.env.TEST_HOST as string);
    const client2 = new TestClient(process.env.TEST_HOST as string);

    await client1.login(email, password);
    await client2.login(email, password);
    expect (await client1.me()).toEqual(await client2.me());

    await client1.logout();
    expect (await client1.me()).toEqual(await client2.me());
  });

  test("Single session logging in and out", async () => {
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
