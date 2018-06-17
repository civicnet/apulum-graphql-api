import * as yup from 'yup';
import * as bcrypt from 'bcryptjs';

import { ResolverMap } from "../../types/graphql-utils";
import { forgotPasswordLockAccount } from "../../utils/forgotPasswordLockAccount";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";
import { User } from "../../entity/User";
import { userNotFoundError, expiredForgotPasswordKey } from "./errorMessages";
import { forgotPasswordPrefix } from "../../constants";
import { registerPasswordValidation } from "../../yupSchemas";
import { formatYupError } from '../../utils/formatYupError';


const schema = yup.object().shape({
  newPassword: registerPasswordValidation
});

export const resolvers: ResolverMap = {
  Query: {
    dummy3: () => "dummy"
  },
  Mutation: {
    sendForgotPasswordEmail: async (
      _,
      { email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
      { redis }
    ) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return [{
          path: 'email',
          message: userNotFoundError,
        }];
      }

      await forgotPasswordLockAccount(user.id, redis);
      await createForgotPasswordLink(
        process.env.FRONTEND_HOST as string,
        user.id,
        redis,
      );

      // @todo send email with url

      return true;
    },
    forgotPasswordChange: async (
      _,
      { newPassword, key }: GQL.IForgotPasswordChangeOnMutationArguments,
      { redis }
    ) => {

      const redisKey = `${forgotPasswordPrefix}${key}`;

      const userId = await redis.get(redisKey);
      if (!userId) {
        return [{
          path: 'newPassword',
          message: expiredForgotPasswordKey
        }]
      }

      try {
        await schema.validate({ newPassword }, { abortEarly: false });
      } catch(err) {
        return formatYupError(err);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatePromise = await User.update({
        id: userId
      }, {
        forgotPasswordLocked: false,
        password: hashedPassword
      });

      const deleteKeyPromise = await redis.del(redisKey);
      await Promise.all([updatePromise, deleteKeyPromise]);

      return null;
    }
  }
}

