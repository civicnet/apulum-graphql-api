import { User } from '../../../entity/User';

import * as casual from 'casual';

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

describe("User management", () => {
  it("Can query users", async () => {
    const email = casual.email;
    const password = casual.password;

    // Make sure we at least register one user
    await client.register(email, password);
    const response = await client.users();

    expect(response.data.users.length).toBeGreaterThanOrEqual(1);
  });

  it("Can query specific user", async () => {
    const email = casual.email;
    const password = casual.password;

    await client.register(email, password);
    const actualUsers = await User.find({ where: { email }});
    expect(actualUsers).toHaveLength(1);

    const user = actualUsers[0];
    const response = await client.user(user.id);
    expect(response.data.user.email).toEqual(email);
  });

  it("Can update user", async () => {
    const email = casual.email;
    const password = casual.password;

    await client.register(email, password);
    const actualUsers = await User.find({ where: { email }});
    expect(actualUsers).toHaveLength(1);

    const user = actualUsers[0];
    const beforeResponse = await client.user(user.id);

    expect(beforeResponse.data.user.firstName).toBeNull();
    expect(beforeResponse.data.user.lastName).toBeNull();

    const newFirstName = casual.first_name;
    const newLastName = casual.last_name;

    const response = await client.updateUser(user.id, newFirstName, newLastName);
    expect(response.data.updateUser).toEqual([{
      id: user.id,
      email,
      firstName: newFirstName,
      lastName: newLastName
    }]);

    const updatedResponse: any = await client.user(user.id);
    expect(updatedResponse.data.user.firstName).toEqual(newFirstName);
    expect(updatedResponse.data.user.lastName).toEqual(newLastName);
  });
});
