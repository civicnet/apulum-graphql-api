import { v4 } from 'uuid';
import { Redis } from 'ioredis';
import { forgotPasswordPrefix } from '../constants';

// https://foo.com => https://foo.com/change-password/<id>
export const createForgotPasswordLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4();
  // Forgot password token valid for the next 20 minutes
  await redis.set(`${forgotPasswordPrefix}${id}`, userId, 'ex', 60*20);

  const finalUrl = `${url}/change-password/${id}`;
  return finalUrl;
}
