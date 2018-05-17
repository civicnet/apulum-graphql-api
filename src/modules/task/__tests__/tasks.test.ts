import { request } from 'graphql-request';
import { v4 } from 'uuid';

import { Task } from '../../../entity/Task';
import { User } from '../../../entity/User';
import { createTypeormConn } from '../../../utils/createTypeormConn';

import {
  titleNotLongEnough,
  descriptionNotLongEnough,
  taskDoesntExist,
  invalidUserID
} from '../errorMessages';

import {
  creationMutation,
  valid_title,
  valid_description,
  tasksByUserQuery,
  tasksQuery,
  singleTaskQuery,
  deletionMutation,
  upForGrabsQuery,
  assignTaskMutation,
  tasksForUser
} from '../queries/queries';

import {
  userCreation,
  valid_email,
  valid_password
} from '../../user/queries/queries';

import { Connection } from 'typeorm';

let conn: Connection;

beforeAll(async () => {
 conn = await createTypeormConn();
})

afterAll(async () => {
  conn.close();
});

describe("Task management", () => {
  it("can create", async () => {
    await request(
      process.env.TEST_HOST as string,
      userCreation(valid_email, valid_password)
    );
    const actualUsers = await User.find({ where: { valid_email }});

    const response = await request(
      process.env.TEST_HOST as string,
      creationMutation(actualUsers[0].id, valid_title, valid_description)
    );
    expect(response).toMatchObject({
      createTask: [{
        description: valid_description,
        title: valid_title
      }]
    });

    // TODO: should probably return success here (implement union type for Error | Success)
    const tasks = await Task.find({ where: { title: valid_title }});
    expect(tasks).toHaveLength(1);

    const task = tasks[0];
    expect(task.title).toEqual(valid_title);
    expect(task.description).toEqual(valid_description);
  });

  it("can query tasks by user", async() => {
    const actualUsers = await User.find({ where: { valid_email }});
    const user = actualUsers[0];

    const response: any = await request(
      process.env.TEST_HOST as string,
      tasksByUserQuery(user.id)
    );
    expect(response.tasksByUser).toHaveLength(1);
  });

  it("can query tasks", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
     tasksQuery()
    );

    expect(response.tasks).toHaveLength(1);
    expect(response.tasks[0].title).toEqual(valid_title);
    expect(response.tasks[0].description).toEqual(valid_description);
  });

  it("can query up-for-grabs tasks", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
      upForGrabsQuery()
    );

    expect(response.upForGrabsTasks).toHaveLength(1);
    expect(response.upForGrabsTasks[0].title).toEqual(valid_title);
  });

  it("can assign task", async () => {
    const actualUsers = await User.find({ where: { valid_email }});
    const user = actualUsers[0];

    const tasks = await Task.find({ where: { title: valid_title }});
    const task = tasks[0];

    const response: any = await request(
      process.env.TEST_HOST as string,
      assignTaskMutation(task.id, user.id)
    );

    expect(response).toEqual({ assignTask: null });
  });

  it("can query tasks assigned to user", async () => {
    const actualUsers = await User.find({ where: { valid_email }});
    const user = actualUsers[0];

    const response: any = await request(
      process.env.TEST_HOST as string,
      tasksForUser(user.id)
    );

    expect(response.tasksForUser).toHaveLength(1);
    expect(response.tasksForUser[0].title).toEqual(valid_title);
  });

  it("can query single task", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
      tasksQuery()
    );

    const singleTask: any = await request(
      process.env.TEST_HOST as string,
      singleTaskQuery(response.tasks[0].id)
    );
    const task = singleTask.task;

    expect(task.title).toEqual(valid_title);
    expect(task.description).toEqual(valid_description);
  });

  it("can search for non-existent task", async () => {
    const noTask: any = await request(
      process.env.TEST_HOST as string,
      singleTaskQuery(v4())
    );
    expect(noTask.task).toBeNull();
  })

  it("can delete valid task", async () => {
    const task: any = await request(
      process.env.TEST_HOST as string,
      tasksQuery()
    );

    const response = await request(
      process.env.TEST_HOST as string,
      deletionMutation(task.tasks[0].id)
    );

    expect(response).toEqual({ deleteTask: null });
  });

  it("can't delete non-existent task", async () => {
    const response = await request(
      process.env.TEST_HOST as string,
      deletionMutation(v4())
    );

    expect(response).toEqual({
      deleteTask: [
        {
          message: taskDoesntExist,
          path: 'task'
        }
      ]
    });
  });

  it("creation fails on bad fields", async () => {
    const response: any = await request(
      process.env.TEST_HOST as string,
      creationMutation('a', 'b', 'c')
    );
    expect(response.createTask).toHaveLength(4);
    expect(response.createTask).toEqual([
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
