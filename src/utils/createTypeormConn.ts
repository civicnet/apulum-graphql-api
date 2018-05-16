import { createConnection, getConnectionOptions } from "typeorm";

export const createTypeormConn = async () => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

    if (process.env.NODE_ENV === 'production') {
      Object.assign(connectionOptions, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        logging: process.env.DB_DEBUG,
      });
    }

    return await createConnection({ ...connectionOptions, name: "default" });
}
