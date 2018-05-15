import request from "graphql-request";
import { createTypeormConn } from "../../../utils/createTypeormConn";

import { User } from "../../../entity/User";
import { Task } from "../../../entity/Task";

import { Connection } from "typeorm";

import { onDemandTaskResolutionsQuery, createOnDemandTaskResolution } from "../queries/queries";
import { userCreation, valid_email, valid_password } from "../../user/queries/queries";
import { creationMutation, valid_title, valid_description } from "../../task/queries/queries";

let conn: Connection;

beforeAll(async () => {
 conn = await createTypeormConn();
})

afterAll(async () => {
  conn.close();
});

// TODO: Add fail cases
describe("On Demand Task Resolution test", () => {
  it("can create task resolution", async () => {
    await request(
      process.env.TEST_HOST as string,
      userCreation(valid_email, valid_password)
    );
    const actualUsers = await User.find({ where: { valid_email }});

    await request(
      process.env.TEST_HOST as string,
      creationMutation(actualUsers[0].id, valid_title, valid_description)
    );

    // TODO: should probably return success here (implement union type for Error | Success)
    const tasks: any = await Task.find({ where: { title: valid_title }});
    const task = tasks[0];

    const response: any = await request(
      process.env.TEST_HOST as string,
      createOnDemandTaskResolution(task.id, valid_description)
    );

    expect(response.createOnDemandTaskResolution).toBeNull();
  });

  it("can query resolutions", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
     onDemandTaskResolutionsQuery()
    );

    expect(response.onDemandTaskResolutions).toHaveLength(1);
    expect(response.onDemandTaskResolutions[0].description).toEqual(valid_description);
  });
});
