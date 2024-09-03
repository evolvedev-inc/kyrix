import { logger, type Middleware } from '@kyrix/server';

import { serverEnv } from './env';

// Chain middlewares and needed, they'll be called in order of their index.
export const middlewareFactory: Middleware[] = [logger({ port: serverEnv.SERVER_PORT })];
