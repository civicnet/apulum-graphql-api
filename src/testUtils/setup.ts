import { startServer } from '../startServer';

export const setup = async () => {
    const app = await startServer();
    const address = app.address();

    let port = 0;
    if (typeof address !== "string") {
      port = address.port;
    }

    process.env.TEST_HOST = `http://127.0.0.1:${port}`;
};
