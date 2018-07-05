import "dotenv/config";
import "reflect-metadata";

import { GraphQLServer } from 'graphql-yoga'
import { redis } from './redis';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as RateLimit from 'express-rate-limit';
import * as RateLimitRedisStore from 'rate-limit-redis';

import { createTypeormConn } from "./utils/createTypeormConn";

import { confirmEmail } from "./routes/confirmEmail";
import { genSchema } from "./utils/genSchema";
import { redisSessionPrefix } from "./constants";

const RedisStore = connectRedis(session);

export const startServer = async () => {
  if (process.env.NODE_ENV === "test") {
    await redis.flushall();
  }

  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('host'),
      session: request.session,
      req: request
    }),
    resolverValidationOptions: {
      requireResolversForResolveType: false
    }
  });

  await createTypeormConn();

  if (process.env.NODE_ENV === 'production') {
    server.express.use(
      new RateLimit({
        windowMs: 15*60*1000,
        max: 100,
        delayMs: 0,
        store: new RateLimitRedisStore({
          client: redis,
        })
      })
    );

    // For Heroku
    server.express.set('trust proxy', 1);
  }

  server.express.use(
    session({
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix,
      }),
      name: 'uid',
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        secure: false, // process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    })
  );

  server.express.get('/confirm/:id', confirmEmail);

  const cors = {
    credentials: true,
    origin: process.env.NODE_ENV === "test"
      ? "*"
      : (process.env.FRONTEND_HOST as string)
  };

  const port = process.env.PORT || 4000;
  const app = server.start({
    cors,
    port: process.env.NODE_ENV === 'test' ? 0 : port
  })

  await app.then(() => {
    console.log('Server is running on localhost:' + port);

    if (process.env.TEST_ENVIRONMENT === 'travis') {
      console.log('Detected Travis environment, shutting down...');
      process.exit();
    }
  });

  return app;
}
