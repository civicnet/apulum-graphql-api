import { request } from 'graphql-request';
import { User } from '../../../entity/User';
import { createTypeormConn } from '../../../utils/createTypeormConn';

import {
  duplicateEmail,
  emailNotLongEnough,
  emailNotValid,
  passwordTooShort
} from '../errorMessages';

import {
  userCreation,
  valid_email,
  valid_password
} from '../../user/queries/queries';

beforeAll(async () => {
  await createTypeormConn();
})

describe("Register user", () => {
  it("can register", async () => {
      const response = await request(
        process.env.TEST_HOST as string,
        userCreation(valid_email, valid_password)
      );
      expect(response).toEqual({ register: null });

      const users = await User.find({ where: { valid_email }});
      expect(users).toHaveLength(1);

      const user = users[0];
      expect(user.email).toEqual(valid_email);
      expect(user.password).not.toEqual(valid_password);
  });

  it("fails on duplicate email", async () => {
      const response: any = await request(
        process.env.TEST_HOST as string,
        userCreation(valid_email, valid_password)
      );
      expect(response.register).toHaveLength(1);
      expect(response.register[0]).toEqual({
        path: 'email',
        message: duplicateEmail
      });
  });

  it("fails on bad email", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
      userCreation("b", valid_password)
    );
    expect(response.register).toHaveLength(2);
    expect(response.register).toEqual([
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
    const response: any = await request(
      process.env.TEST_HOST as string,
      userCreation(valid_email, 'a')
    );
    expect(response.register).toHaveLength(1);
    expect(response.register).toEqual([
      {
        path: 'password',
        message: passwordTooShort
      }
    ]);
  });

  it("fails on bad email and password", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
      userCreation('a', 'a')
    );
    expect(response.register).toHaveLength(3);
    expect(response.register).toEqual([
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
