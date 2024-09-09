import { SSRRoute } from '@kyrix/server';
import { TRPCContext } from './trpc/trpc';

export const ssrRoutes = [
  {
    id: 'Home' as const,
    path: '/',
    handler: async () => {
      await new Promise((r) => setTimeout(r, 3000));
      return {
        meta: { title: 'Home', description: 'Home page desc', author: 'Nilotpaul Nandi' },
        initialData: [{ name: 'Paul', age: 20 }],
      };
    },
  },
  {
    id: 'Action' as const,
    path: '/action',
    handler: async () => {
      return {
        meta: { title: 'Action', description: 'Action page desc' },
        initialData: [{ name: 'Soham', age: 21 }],
      };
    },
  },
  {
    id: 'test' as const,
    path: '/test/:testId',
    handler: (_, { testId }) => {
      return {
        meta: {
          title: testId as string,
          description: testId as string,
        },
      };
    },
  },
] satisfies SSRRoute<TRPCContext>[];
