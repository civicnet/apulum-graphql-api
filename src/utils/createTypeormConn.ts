import { createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const createTypeormConn = async (
  options: {
    reset: boolean,
    sync: boolean,
    debug: boolean,
  } = { reset: false, sync: false, debug: false }
) => {
  // const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  let connectionOptions: PostgresConnectionOptions = {
    name: "default",
    type: "postgres",
    logging: options.debug,
    synchronize: options.sync,
    dropSchema: options.reset,
  };

  if (process.env.NODE_ENV !== 'production') {
    connectionOptions = {
      ...connectionOptions,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: Number(process.env.DB_PORT),
      host: process.env.DB_HOST,
      entities: [
        "src/entity/**/*.ts"
      ],
      migrations: [
        "src/migration/**/*.ts"
      ],
      subscribers: [
        "src/subscriber/**/*.ts"
      ],
      cli: {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
      }
    };
  } else {
    connectionOptions = {
      ...connectionOptions,
      url: process.env.DATABASE_URL,
      entities: [
        "../entity/**/*.js"
      ],
      migrations: [
        "../migration/**/*.js"
      ],
      subscribers: [
        "../subscriber/**/*.js"
      ],
    }
  }

  if (process.env.DB_DEBUG === 'true') {
    console.log(connectionOptions);
  }
  return createConnection(connectionOptions);
}
