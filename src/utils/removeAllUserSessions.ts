import { userSessionIDPrefix, redisSessionPrefix } from "../constants";
import { Redis } from "ioredis";

export const removeAllUserSessions = async (userId: string, redis: Redis) => {
  const sessionIds = await redis.lrange(
    `${userSessionIDPrefix}${userId}`,
    0,
    -1
  );

  const promises = [];
  for (let i = 0; i < sessionIds.length; i += 1) {
    promises.push(redis.del(`${redisSessionPrefix}${sessionIds[i]}`));
  }
  await Promise.all(promises);
} 