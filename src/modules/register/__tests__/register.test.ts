import * as casual from 'casual';
import { User } from '../../../entity/User';

import {
  duplicateEmail,
  emailNotLongEnough,
  emailNotValid,
  passwordTooShort
} from '../errorMessages';

import { Connection } from 'typeorm';
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { TestClient } from '../../../utils/TestClient';

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

describe("Register user", () => {
  it("can register", async () => {
    const email = casual.email;
    const password = casual.password;

    const response = await client.register(email, password);
    expect(response).toEqual({data: { register: null }});

    const users = await User.find({ where: { email }});
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it("fails on duplicate email", async () => {
    const email = casual.email;
    const password = casual.password;

    await client.register(email, password);
    const response2 = await client.register(email, password);

    expect(response2.data.register).toHaveLength(1);
    expect(response2.data.register[0]).toEqual({
      path: 'email',
      message: duplicateEmail
    });
  });

  it("fails on bad email", async () => {
    const email = 'a';
    const password = casual.password;

    const response = await client.register(email, password);
    expect(response.data.register).toHaveLength(2);
    expect(response.data.register).toEqual([
      {
        path: 'email',
        message: emailNotLongEnough
      },
      {
        path: 'email',
        message: emailNotValid
      }
    ]);
  });

  it("fails on bad password", async () => {
    const email = casual.email;
    const password = '';

    const response = await client.register(email, password);
    expect(response.data.register).toHaveLength(1);
    expect(response.data.register).toEqual([
      {
        path: 'password',
        message: passwordTooShort
      }
    ]);
  });

  it("fails on bad email and password", async () => {
    const email = 'a';
    const password = '';

    const response = await client.register(email, password);
    expect(response.data.register).toHaveLength(3);
    expect(response.data.register).toEqual([
      {
        path: 'email',
        message: emailNotLongEnough
      },
      {
        path: 'email',
        message: emailNotValid
      },
      {
        path: 'password',
        message: passwordTooShort
      }
    ]);
  });
});
