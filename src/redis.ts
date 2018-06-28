import * as Redis from 'ioredis';

const config = process.env.REDIS_URL || undefined;
export const redis = new Redis(config);
