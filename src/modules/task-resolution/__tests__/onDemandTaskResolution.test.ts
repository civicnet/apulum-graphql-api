import * as casual from 'casual';

import { User } from "../../../entity/User";
import { Task } from "../../../entity/Task";

import { Connection } from "typeorm";

import { createTypeormConn } from "../../../utils/createTypeormConn";
import { TestClient } from "../../../utils/TestClient";

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

// TODO: Add fail cases
describe("On Demand Task Resolution test", () => {
  it("can create task resolution", async () => {
    const email = casual.email;
    const password = casual.password;
    await client.register(email, password);
    const actualUsers = await User.find({ where: { email }});

    const title = casual.title;
    const description = casual.description;
    await client.createTask(actualUsers[0].id, title, description);

    // TODO: should probably return success here (implement union type for Error | Success)
    const tasks = await Task.find({ where: { title }});
    const task = tasks[0];

    const response: any = await client.createOnDemandTaskResolution(task.id, description);
    expect(response.data.createOnDemandTaskResolution).toBeNull();
  });

  it("can query resolutions", async () => {
    const response: any = await client.onDemandTaskResolutions();
    expect(response.data.onDemandTaskResolutions.length).toBeGreaterThanOrEqual(1);
  });
});
