import { request } from 'graphql-request';
import * as casual from 'casual';

import { User } from '../../../entity/User';

import {
  invalidLogin,
  confirmEmailError
} from '../errorMessages';

import { Connection } from 'typeorm';
import { TestClient } from '../../../utils/TestClient';
import { createTypeormConn } from '../../../utils/createTypeormConn';

let conn: Connection;
let client: TestClient;

beforeAll(async () => {
  conn = await createTypeormConn();
  client = new TestClient(
    process.env.TEST_HOST as string
  );
})

afterAll(async () => {
  conn.close();
});

describe("Login user", () => {
  it("can't login with unknown email", async () => {
    const email = casual.email;
    const password = casual.password;
    const response = await client.login(email, password);

    expect(response.data).toEqual({
      login: [
        {
          path: 'login',
          message: invalidLogin
        }
      ]
    });
  });

  it('needs account confirmation', async() => {
    const email = casual.email;
    const password = casual.password;

    await client.register(email, password);
    const response = await client.login(email, password);

    expect(response.data).toEqual({
      login: [{
        path: 'login',
        message: confirmEmailError
      }]
    });
  });

  test('can login', async() => {
    const email = casual.email;
    const password = casual.password;
    await client.register(email, password);

    await User.update({ email }, { confirmed: true });
    const response = await client.login(email, password);

    expect(response.data).toEqual({ login: null });
  });

  test('can\'t login with bad password', async() => {
    const email = casual.email;
    const password = casual.password;
    await client.register(email, password);

    await User.update({ email }, { confirmed: true });
    const response = await client.login(email, 'a');

    expect(response.data).toEqual({
      login: [
        {
          path: 'login',
          message: invalidLogin
        }
      ]
    });
  });
})
