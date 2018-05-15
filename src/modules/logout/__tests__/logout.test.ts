import axios from 'axios';

import { Connection } from 'typeorm';
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { User } from '../../../entity/User';
import * as casual from 'casual';

import { loginAndQueryMeTest, noCookieTest } from '../../me/queries/queries';
import { logoutMutation } from '../queries/queries';

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

describe('Logout test', () => {
  test("Test logging out a user", async () => {
    loginAndQueryMeTest(email, pass, userId);

    await axios.post(
      process.env.TEST_HOST as string,
      {
        query: logoutMutation
      },
      {
        withCredentials: true
      }
    );

    await noCookieTest(true);
  });
});
