import { createConnection } from "typeorm";

export const createTypeormConn = async (
  options: {
    resetDB: boolean
  } = { resetDB: true }
) => {
  const database = process.env.NODE_ENV !== 'test'
    ? process.env.DB_DATABASE
    : process.env.DB_TEST_DATABASE;

  let databaseCredentials: {} = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database,
    logging: !!process.env.DB_DEBUG,
  };

  let schemaFiles = {
    entities: [
      "src/entity/**/*.ts"
    ],
    migrations: [
      "src/migration/**/*.ts"
    ],
    subscribers: [
      "src/subscriber/**/*.ts"
    ],
  };

  let cliDirs = {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/migration",
    "subscribersDir": "src/subscriber"
  };

  if (process.env.NODE_ENV === 'production') {
    // Heroku periodically rotates the credentials
    // and updates the DATABASE_URL, use that instead
    databaseCredentials = {
      url: process.env.DATABASE_URL,
    }

    // Production code runs on node so we use the transpiled code
    schemaFiles = {
      entities: [
        "entity/**/*.js"
      ],
      migrations: [
        "migration/**/*.js"
      ],
      subscribers: [
        "subscriber/**/*.js"
      ],
    }

    cliDirs = {
      "entitiesDir": "entity",
      "migrationsDir": "migration",
      "subscribersDir": "subscriber"
    };
  }

  const connectionOptions = {
    name: "default",
    type: "postgres",
    synchronize: !!process.env.DB_SYNC,
    dropSchema: options.resetDB ? options.resetDB : !!process.env.DB_DROP_SCHEMA,
    ...databaseCredentials,
    ...schemaFiles,
    cli: cliDirs
  };

  if (process.env.DB_DEBUG) {
    console.log(process.env.DB_SYNC);
    console.log(connectionOptions);
  }

  return createConnection(connectionOptions as any);
}
