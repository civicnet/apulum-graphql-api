import { v4 } from 'uuid';
import * as casual from 'casual';

import { Task } from '../../../entity/Task';
import { User } from '../../../entity/User';

import {
  titleNotLongEnough,
  descriptionNotLongEnough,
  taskDoesntExist,
  invalidUserID
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

describe("Task management", () => {
  it("can create", async () => {
    const email = casual.email;
    const password = casual.password;

    await client.register(email, password);
    const actualUsers = await User.find({ where: { email }});

    const title = casual.sentence;
    const description = casual.sentence;
    const response = await client.createTask(actualUsers[0].id, title, description);

    expect(response.data).toMatchObject({
      createTask: [{
        description,
        title
      }]
    });

    // TODO: should probably return success here (implement union type for Error | Success)
    const tasks = await Task.find({ where: { title }});
    expect(tasks.length).toBeGreaterThanOrEqual(1);

    const task = tasks[0];
    expect(task.title).toEqual(title);
    expect(task.description).toEqual(description);
  });

  it("can query tasks by user", async() => {
    const email = casual.email;
    const password = casual.password;
    await client.register(email, password);

    const actualUsers = await User.find({ where: { email }});
    const user = actualUsers[0];

    const title = casual.sentence;
    const description = casual.sentence;
    await client.createTask(user.id, title, description);

    const response = await client.tasksByUser(user.id);
    expect(response.data.tasksByUser).toHaveLength(1);
  });

  it("can query tasks", async () => {
    const response: any = await client.tasks();
    expect(response.data.tasks.length).toBeGreaterThanOrEqual(1);
  });

  it("can query up-for-grabs tasks", async () => {
    const response: any = await client.upForGrabsTasks();
    expect(response.data.upForGrabsTasks.length).toBeGreaterThanOrEqual(1);
  });

  it("can assign task", async () => {
    const email = casual.email;
    const password = casual.password;
    await client.register(email, password);

    const actualUsers = await User.find({ where: { email }});
    const user = actualUsers[0];

    const title = casual.sentence;
    const description = casual.description;
    await client.createTask(user.id, title, description);
    const tasks = await Task.find({ where: { title }});
    const task = tasks[0];

    const response = await client.assignTask(task.id, user.id);
    expect(response.data).toEqual({ assignTask: null });
  });

  it("can query tasks assigned to user", async () => {
    const email = casual.email;
    const password = casual.password;
    await client.register(email, password);

    const actualUsers = await User.find({ where: { email }});
    const user = actualUsers[0];

    const title = casual.sentence;
    const description = casual.description;
    await client.createTask(user.id, title, description);
    const tasks = await Task.find({ where: { title }});
    const task = tasks[0];
    await client.assignTask(task.id, user.id);

    const response = await client.tasksForUser(user.id);
    expect(response.data.tasksForUser).toHaveLength(1);
    expect(response.data.tasksForUser[0].title).toEqual(title);
  });

  it("can query single task", async () => {
    const email = casual.email;
    const password = casual.password;
    await client.register(email, password);

    const actualUsers = await User.find({ where: { email }});
    const user = actualUsers[0];

    const title = casual.sentence;
    const description = casual.description;
    await client.createTask(user.id, title, description);
    const tasks = await Task.find({ where: { title }});
    const task = tasks[0];

    const singleTask = await client.task(task.id);
    const queriedTask = singleTask.data.task;

    expect(queriedTask.title).toEqual(title);
    expect(queriedTask.description).toEqual(description);
  });

  it("can search for non-existent task", async () => {
    const noTask = await client.task(v4());
    expect(noTask.data.task).toBeNull();
  })

  it("can delete valid task", async () => {
    const task = await client.tasks();
    const response = await client.deleteTask(task.data.tasks[0].id);

    expect(response.data).toEqual({ deleteTask: null });
  });

  it("can't delete non-existent task", async () => {
    const response = await client.deleteTask(v4());
    expect(response.data).toEqual({
      deleteTask: [
        {
          message: taskDoesntExist,
          path: 'task'
        }
      ]
    });
  });

  it("creation fails on bad fields", async () => {
    const response = await client.createTask('a', 'b', 'c');
    expect(response.data.createTask).toHaveLength(4);
    expect(response.data.createTask).toEqual([
      {
        path: 'title',
        message: titleNotLongEnough
      },
      {
        path: 'description',
        message: descriptionNotLongEnough
      },
      {
        path: 'userId',
        message: invalidUserID,
      },
      {
        path: 'userId',
        message: invalidUserID,
      }
    ]);
  });
});
