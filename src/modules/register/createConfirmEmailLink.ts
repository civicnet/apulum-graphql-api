import { v4 } from 'uuid';
import { Redis } from 'ioredis';

// https://foo.com => https://foo.com/confirm/<id>
export const createConfirmEmailLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4();
  // Account confirmation valid for 24 hours
  await redis.set(id, userId, 'ex', 60*60*24);

  const finalUrl = `${url}/confirm/${id}`;
  return finalUrl;
}
