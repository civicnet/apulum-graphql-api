import axios from 'axios';

import { Connection } from 'typeorm';
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { User } from '../../../entity/User';
import * as casual from 'casual';

import {
  loginMutation
} from '../../login/queries/queries';
import { meQuery } from '../queries/queries';

let conn: Connection;
let email = casual.email;
let pass = casual.password;
let userId: string;

beforeAll(async() => {
  conn = await createTypeormConn();
  const user = await User.create({
    email: email,
    password: pass,
    confirmed: true,
  }).save();
  userId = user.id;
})

afterAll(async () => {
  conn.close();
});

describe('Me query', () => {
  test('can\'t get user if not logged in', async() => {
    // later
  });

  test('can get current user', async() => {
    await axios.post(
      process.env.TEST_HOST as string,
      {
        query: loginMutation(email, pass)
      },
      {
        withCredentials: true
      }
    );

    const response = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery
      },
      {
        withCredentials: true
      }
    );

    expect(response.data.data).toEqual({
      me: {
        id: userId,
        email: email
      }
    });
  });
});
