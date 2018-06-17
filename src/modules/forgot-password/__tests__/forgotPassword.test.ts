import { Connection } from 'typeorm';
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { User } from '../../../entity/User';
import * as casual from 'casual';

import { TestClient } from '../../../utils/TestClient';
import { createForgotPasswordLink } from '../../../utils/createForgotPasswordLink';
import * as Redis from 'ioredis';
import { forgotPasswordLocked } from '../../login/errorMessages';
import { passwordTooShort } from '../../register/errorMessages';
import { expiredForgotPasswordKey } from '../errorMessages';
import { forgotPasswordLockAccount } from '../../../utils/forgotPasswordLockAccount';

let conn: Connection;
const redis = new Redis();
let email = casual.email;
let password = casual.password;
let userId: string;

const newPassword = casual.password;

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

describe('Forgot password test', () => {
  test('Can update forgotten password and login', async() => {
    const client = new TestClient(process.env.TEST_HOST as string);

    await forgotPasswordLockAccount(userId, redis);
    // Lock account and send email
    const url = await createForgotPasswordLink("", userId, redis);
    const parts = url.split('/');
    const key = parts[parts.length - 1];

    // Make sure we can't login if account locked
    expect(await client.login(email, password)).toEqual({
      data: {
        login: [{
          path: 'login',
          message: forgotPasswordLocked
        }]
      }
    });

    // Try invalid password (too short)
    expect(await client.forgotPasswordChange('a', key)).toEqual({
      data: {
        forgotPasswordChange: [{
          path: 'newPassword',
          message: passwordTooShort
        }]
      }
    });

    const response = await client.forgotPasswordChange(newPassword, key);
    expect(response.data).toEqual({
      forgotPasswordChange: null
    });

    // Make sure redis key expires after password change
    const badResponse = await client.forgotPasswordChange(newPassword, key);
    expect(badResponse.data).toEqual({
      forgotPasswordChange: [{
        path: 'newPassword',
        message: expiredForgotPasswordKey
      }]
    });

    expect(await client.login(email, newPassword)).toEqual({
      data: {
        login: null
      }
    });
  });
});
