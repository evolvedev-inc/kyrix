import { SSRRoute } from '@kyrix/server';
import { TRPCContext } from './trpc/trpc';

export const ssrRoutes = [
  {
    id: 'Home' as const,
    path: '/',
    handler: () => ({
      meta: { title: 'Home', description: 'Home page desc', author: 'Nilotpaul Nandi' },
      initialData: [{ name: 'Paul', age: 20 }],
    }),
  },
  {
    id: 'Action' as const,
    path: '/action',
    handler: async () => {
      return {
        meta: { title: 'Action', description: 'Action page desc' },
      };
    },
  },
  {
    id: 'test' as const,
    path: '/test/:testId',
    handler: (ctx, params) => {
      return {
        meta: {
          title: params.testId as string,
          description: params.testId as string,
        },
      };
    },
  },
] satisfies SSRRoute<TRPCContext>[];
