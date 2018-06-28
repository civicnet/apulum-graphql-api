import * as yup from "yup";

import { ResolverMap } from "../../types/graphql-utils";
import { Task } from '../../entity/Task';
import { formatYupError } from '../../utils/formatYupError';

import {
  descriptionNotLongEnough,
  titleNotLongEnough,
  taskDoesntExist,
  invalidUserID,
  assigneeDoesntExist
} from "./errorMessages";

import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import { uuidRegex } from "../../utils/uuidRegex";

const schema = yup.object().shape({
  title: yup
    .string()
    .min(3, titleNotLongEnough)
    .max(255),
  description: yup
    .string()
    .min(3, descriptionNotLongEnough),
  userId: yup
    .string()
    .min(36, invalidUserID)
    .max(36, invalidUserID)
    .matches(uuidRegex, invalidUserID)
});

export const resolvers: ResolverMap = {
  MaybeTask: {
    __resolveType: (obj) => {
      if (obj.path) {
        return 'Error';
      }

      return 'Task';
    },
  },
  Query: {
    tasks: async () => {
      const tasks = await getRepository(Task)
        .createQueryBuilder('task')
        .innerJoinAndSelect('task.creator', 'creator')
        .getMany();

      return tasks;
    },
    task: async (_, { id }: GQL.ITaskOnQueryArguments) => {
      return await Task.findOne({
        where: { id },
        relations: ['creator']
      });
    },
    tasksByUser: async (_, { id }: GQL.ITaskOnQueryArguments) => {
      return await Task.find({
        where: { creator: id },
        relations: ['creator']
      });
    },
    tasksForUser: async (_, { id }: GQL.ITaskOnQueryArguments) => {
      return await Task.find({
        where: { asignee: id },
        relations: ['asignee']
      });
    },
    upForGrabsTasks: async () => {
      return await Task.find({
        where: { asignee: null },
        relations: ['creator']
      });
    }
  },

  Mutation: {
    createTask: async (_, args: GQL.ICreateTaskOnMutationArguments) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch(err) {
        return formatYupError(err);
      }

      const { title, description, userId } = args;
      const creator = await User.findOne(userId);

      if (!creator) {
        return [{
          path: 'task',
          message: invalidUserID
        }]
      }

      let task = await Task.create({
        creator: creator,
        title: title,
        description: description,
      }).save();

      return [task];
    },
    deleteTask: async (_, { id }: GQL.IDeleteTaskOnMutationArguments) => {
      const task = await Task.findOne({
        where: { id: id },
        select: ['id']
      });

      if (!task) {
        return [
          {
            path: 'task',
            message: taskDoesntExist
          }
        ]
      }

      await Task.delete({ id: id });
      return null;
    },
    assignTask: async (_, { taskId, userId }: GQL.IAssignTaskOnMutationArguments) => {
      const task = await Task.findOne({
        where: { id: taskId },
        select: ['id']
      });

      if (!task) {
        return [
          {
            path: 'task',
            message: taskDoesntExist
          }
        ]
      }
      const asignee = await User.findOne({
        where: { id: userId },
        select: ['id']
      });

      if (!asignee) {
        return [
          {
            path: 'task',
            message: assigneeDoesntExist
          }
        ]
      }

      task.asignee = asignee;
      await task.save();

      return null;
    }
  }
}

