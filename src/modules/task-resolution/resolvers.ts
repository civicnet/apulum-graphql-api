import * as yup from 'yup';

import { ResolverMap } from "../../types/graphql-utils";
import { OnDemandTaskResolution, IOnDemandTaskResolution } from "../../entity/OnDemandTaskResolution";
import { getRepository, BaseEntity } from "typeorm";

import {
  invalidTaskID,
  descriptionTooShort
} from './errorMessages';

import { formatYupError } from '../../utils/formatYupError';
import { Task } from '../../entity/Task';
import { uuidRegex } from '../../utils/uuidRegex';
import { UserApprovalTaskResolution } from '../../entity/UserApprovalTaskResolution';
import { DueDateTaskResolution } from '../../entity/DueDateTaskResolution';
import { ITaskResolution } from '../../entity/TaskResolution';

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

  await OnDemandTaskResolution.create<
     ITaskResolution & IOnDemandTaskResolution & BaseEntity
  >({
    task: task,
    resolution: {
      description: description,
    }
  }).save();

  return null;
}

const queryResolutions = async(resolution: any) => {
  const response = await getRepository(resolution)
    .createQueryBuilder('resolution')
    .innerJoinAndSelect('resolution.task', 'task')
    .innerJoinAndSelect('task.creator', 'creator')
    .getMany();

  return response.map((res: any) => ({
    ...res,
    ...res.resolution,
  }));
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
    taskResolutionForTask: async (_, __: GQL.ITaskOnQueryArguments) => {
      return null;
    },
    taskResolution: async (_, __: GQL.ITaskOnQueryArguments) => {
      return null;
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

