import { request } from 'graphql-request';
import { User } from '../../../entity/User';
import { createTypeormConn } from '../../../utils/createTypeormConn';

import {
  invalidLogin,
  confirmEmailError
} from '../errorMessages';

import {
  valid_email,
  valid_password,
  userCreation
} from '../../user/queries/queries';

import { Connection } from 'typeorm';
import { TestClient } from '../../../utils/TestClient';

let conn: Connection;

beforeAll(async () => {
 conn = await createTypeormConn();
})

afterAll(async () => {
  conn.close();
});

describe('Login user', () => {
  test('can\'t login with unknown email', async() => {
    const client = new TestClient(
      process.env.TEST_HOST as string
    );
    const response = await client.login(valid_email, valid_password);

    expect(response.data).toEqual({
      login: [
        {
          path: 'login',
          message: invalidLogin
        }
      ]
    });
  });

  test('needs account confirmation', async() => {
    await request(
      process.env.TEST_HOST as string,
      userCreation(valid_email, valid_password)
    );

    const client = new TestClient(
      process.env.TEST_HOST as string
    );
    const response = await client.login(valid_email, valid_password);

    expect(response.data).toEqual({
      login: [{
        path: 'login',
        message: confirmEmailError
      }]
    });
  });

  test('can login', async() => {
    await User.update({ email: valid_email }, { confirmed: true });

    const client = new TestClient(
      process.env.TEST_HOST as string
    );
    const response = await client.login(valid_email, valid_password);

    expect(response.data).toEqual({ login: null });
  });

  test('can\'t login with bad password', async() => {
    const client = new TestClient(
      process.env.TEST_HOST as string
    );
    const response = await client.login(valid_email, 'a');

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
