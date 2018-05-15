import * as bcrypt from 'bcryptjs';
//import * as yup from "yup";

import { ResolverMap } from "../../types/graphql-utils";
import { User } from '../../entity/User';
import { invalidLogin, confirmEmailError } from "./errorMessages";
import { userSessionIDPrefix } from '../../constants';

const errorResponse = [{
  path: 'login',
  message: invalidLogin,
}];

export const resolvers: ResolverMap = {
  Query: {
    bye2: () => `Bye.`,
  },
  Mutation: {
    login: async (_, { email, password } : GQL.ILoginOnMutationArguments, { session, redis, req }) => {
      const user = await User.findOne({ where: { email }});

      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [{
          path: 'login',
          message: confirmEmailError
        }]
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return errorResponse;
      }

      session.userId = user.id;
      if (req.sessionID) {
        await redis.lpush(`${userSessionIDPrefix}${user.id}`, req.sessionID);
      }

      return null;
    }
  }
}

