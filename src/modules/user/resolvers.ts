import { ResolverMap } from "../../types/graphql-utils";
import { User } from '../../entity/User';
import { getRepository } from "typeorm";

export const resolvers: ResolverMap = {
  Query: {
    users: async () => {
      return await getRepository(User)
        .createQueryBuilder('user')
        .getMany();
    },
    user: async (_, { id }: GQL.IUserOnQueryArguments) => {
      return await User.findOne({
        where: { id },
      });
    },
  },
}

