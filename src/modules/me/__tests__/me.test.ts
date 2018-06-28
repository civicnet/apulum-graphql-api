import { Connection } from 'typeorm';
import { User } from '../../../entity/User';
import * as casual from 'casual';

import { TestClient } from '../../../utils/TestClient';
import { createTypeormConn } from '../../../utils/createTypeormConn';

let conn: Connection;
const email = casual.email;
const pass = casual.password;
let userId: string;

const client = new TestClient(
  process.env.TEST_HOST as string
);

beforeAll(async() => {
  conn = await createTypeormConn();
  const user = await User.create({
    email,
    password: pass,
    confirmed: true,
  }).save();
  userId = user.id;
})

afterAll(async () => {
  conn.close();
});

describe('Me query', () => {
  test('Return null if no cookie', async() => {
    const response = await client.me();
    expect(response.data.me).toBeNull();
  });

  test('Can get current user', async() => {
    await client.login(email, pass);
    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        email,
        id: userId
      }
    })
  });
});
