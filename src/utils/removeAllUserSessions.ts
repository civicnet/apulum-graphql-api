import { userSessionIDPrefix, redisSessionPrefix } from "../constants";
import { Redis } from "ioredis";

export const removeAllUserSessions = async (userId: string, redis: Redis) => {
  const sessionIds = await redis.lrange(
    `${userSessionIDPrefix}${userId}`,
    0,
    -1
  );

  const promises = [];
  for (const sessId of sessionIds) {
    promises.push(redis.del(`${redisSessionPrefix}${sessId}`));
  }
  await Promise.all(promises);
}
