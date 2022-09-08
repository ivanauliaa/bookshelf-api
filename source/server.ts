import Hapi, { Server } from '@hapi/hapi';
import routes from './routes';

const init = async (): Promise<Server> => {
  const server: Server = Hapi.server({
    port: 5000,
    host: 'localhost',
  });

  await server.route(routes);

  return server;
};

const start = async (server: Server): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log(`Listening on ${server.info.uri}`);

  return server.start();
};

export { init, start };
