import { createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const createTypeormConn = async (
  options: {
    resetDB: boolean
  } = { resetDB: false }
) => {
  // const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  let connectionOptions: PostgresConnectionOptions = {
    name: "default",
    type: "postgres",
    logging: process.env.DB_DEBUG === 'true',
    synchronize: options.resetDB,
    dropSchema: options.resetDB,
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
        "entity/**/*.js"
      ],
      migrations: [
        "migration/**/*.js"
      ],
      subscribers: [
        "subscriber/**/*.js"
      ],
      cli: {
        "entitiesDir": "entity",
        "migrationsDir": "migration",
        "subscribersDir": "subscriber"
      }
    }
  }

  return createConnection(connectionOptions);
}
