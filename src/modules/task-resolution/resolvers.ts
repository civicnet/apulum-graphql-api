import * as yup from 'yup';

import { ResolverMap } from "../../types/graphql-utils";
import { OnDemandTaskResolution } from "../../entity/OnDemandTaskResolution";
import { getRepository } from "typeorm";

import {
  invalidTaskID,
  descriptionTooShort
} from './errorMessages';

import { formatYupError } from '../../utils/formatYupError';
import { Task } from '../../entity/Task';
import { uuidRegex } from '../../utils/uuidRegex';
import { UserApprovalTaskResolution } from '../../entity/UserApprovalTaskResolution';
import { DueDateTaskResolution } from '../../entity/DueDateTaskResolution';
import { TaskResolution } from '../../entity/TaskResolution';

const schema = yup.object().shape({
  taskId: yup
    .string()
    .min(36, invalidTaskID)
    .max(36, invalidTaskID)
    .matches(uuidRegex, invalidTaskID),
  description: yup
    .string()
    .min(16, descriptionTooShort)
});

const createResolution = async(taskId: string, description: string) => {
  try {
    await schema.validate({taskId, description}, { abortEarly: false });
  } catch(err) {
    return formatYupError(err);
  }

  const task = await Task.findOne(taskId);

  if (!task) {
    return [{
      path: 'task',
      message: invalidTaskID
    }]
  }

  await OnDemandTaskResolution.create({
    task: task,
    description: description,
  }).save();

  return null;
}

const queryResolutions = async(resolution: any) => {
  return await getRepository(resolution)
    .createQueryBuilder('resolution')
    .innerJoinAndSelect('resolution.task', 'task')
    .innerJoinAndSelect('task.creator', 'creator')
    .getMany();
};

export const resolvers: ResolverMap = {
  ITaskResolution: {
    __resolveType: (obj) => {
      if (obj.approver) {
        return 'UserApprovalTaskResolution';
      } else if (obj.dueDate) {
        return 'DueDateTaskResolution';
      }

      return 'OnDemandTaskResolution';
    },
  },
  Query: {
    onDemandTaskResolutions: async () => {
      return await queryResolutions(OnDemandTaskResolution);
    },
    userApprovalTaskResolutions: async () => {
      return await queryResolutions(UserApprovalTaskResolution);
    },
    dueDateTaskResolutions: async () => {
      return await queryResolutions(DueDateTaskResolution);
    },
    taskResolutionForTask: async (_, { id }: GQL.ITaskOnQueryArguments) => {
      const response: any = await Task.findOne({
        where: { id },
        relations: ['resolution']
      });

      return response.resolution;
    },
    taskResolution: async (_, { id }: GQL.ITaskOnQueryArguments) => {
      return await TaskResolution.findOne({
        where: { id },
        relations: ['task']
      });
    },

  },

  // TODO: Don't allow overwriting resolutions
  Mutation: {
    createOnDemandTaskResolution: async (_, args: GQL.ICreateOnDemandTaskResolutionOnMutationArguments) => {
      const { taskId, description } = args;
      return await createResolution(taskId, description);
    },
    createUserApprovalTaskResolution: async (_, args: GQL.ICreateUserApprovalTaskResolutionOnMutationArguments) => {
      const { taskId, description } = args;
      return await createResolution(taskId, description);
    },
    createDueDateTaskResolution: async (_, args: GQL.ICreateDueDateTaskResolutionOnMutationArguments) => {
      const { taskId, description } = args;
      return await createResolution(taskId, description);
    },
  }
}

