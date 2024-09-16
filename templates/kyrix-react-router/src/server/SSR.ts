import type { TRPCContext } from './trpc/trpc';
import type { SSRRoute } from '@kyrix/server';

export const ssrRoutes = [
  {
    id: 'Home' as const,
    path: '/',
    handler: async () => ({
      meta: {
        title: 'Home',
        description: 'Home page of kyrix',
      },
      initialData: 'Data from server',
    }),
  },
] satisfies SSRRoute<TRPCContext>[];
