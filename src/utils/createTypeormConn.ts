import { createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { DueDateTaskResolution } from "../entity/DueDateTaskResolution";
import { IncidentReport } from "../entity/IncidentReport";
import { IncidentReportComment } from "../entity/IncidentReportComment";
import { OnDemandTaskResolution } from "../entity/OnDemandTaskResolution";
import { Task } from "../entity/Task";
import { User } from "../entity/User";
import { UserApprovalTaskResolution } from "../entity/UserApprovalTaskResolution";

export const createTypeormConn = async (
  options: {
    reset: boolean,
    sync: boolean,
    debug: boolean,
  } = { reset: false, sync: false, debug: false }
) => {
  let connectionOptions: PostgresConnectionOptions = {
    name: "default",
    type: "postgres",
    logging: options.debug,
    synchronize: options.sync,
    dropSchema: options.reset,
    entities: [
      DueDateTaskResolution,
      IncidentReport,
      IncidentReportComment,
      OnDemandTaskResolution,
      Task,
      User,
      UserApprovalTaskResolution
    ],
  };

  if (process.env.NODE_ENV !== 'production') {
    connectionOptions = {
      ...connectionOptions,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.NODE_ENV === 'test'
        ? process.env.DB_TEST_DATABASE
        : process.env.DB_DATABASE,
      port: Number(process.env.DB_PORT),
      host: process.env.DB_HOST,
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
