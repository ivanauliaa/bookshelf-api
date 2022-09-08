import { Server } from '@hapi/hapi';
import { init, start } from './server';

init().then((server: Server) => start(server));
