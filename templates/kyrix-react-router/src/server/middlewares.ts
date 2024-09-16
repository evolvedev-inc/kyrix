import { logger, type Middleware } from '@kyrix/server';

import { serverEnv as env } from './env';

// Chain middlewares and needed, they'll be called in order of their index.
export const middlewareFactory: Middleware[] = [logger({ port: env.SERVER_PORT })];
