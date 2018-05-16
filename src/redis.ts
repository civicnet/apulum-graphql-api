import * as Redis from 'ioredis';

let config = process.env.REDIS_URL || undefined;
export const redis = new Redis(config);
