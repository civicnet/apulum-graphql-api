import { v4 } from 'uuid';
import { Redis } from 'ioredis';

// https://foo.com => https://foo.com/confirm/<id>
export const createConfirmEmailLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4();
  console.log("Setting id " + id + " for " + userId);
  await redis.set(id, userId, 'ex', 60*60*24);

  let finalUrl = `${url}/confirm/${id}`;
  return finalUrl;
}
