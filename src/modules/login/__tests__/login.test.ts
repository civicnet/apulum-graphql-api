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

import {
  loginMutation
} from '../queries/queries';

beforeAll(async () => {
  await createTypeormConn();
})

describe('Login user', () => {
  test('can\'t login with unknown email', async() => {
    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(valid_email, valid_password)
    );

    expect(response).toEqual({
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

    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(valid_email, valid_password)
    );

    expect(response).toEqual({
      login: [{
        path: 'login',
        message: confirmEmailError
      }]
    });
  });

  test('can login', async() => {
    await User.update({ email: valid_email }, { confirmed: true });

    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(valid_email, valid_password)
    );

    expect(response).toEqual({ login: null });
  });

  test('can\'t login with bad password', async() => {
    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(valid_email, 'a')
    );

    expect(response).toEqual({
      login: [
        {
          path: 'login',
          message: invalidLogin
        }
      ]
    });
  });
})
