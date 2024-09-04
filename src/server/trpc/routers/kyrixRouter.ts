import { handleSSR } from '@kyrix/server';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const kyrixRouter = router({
  ssr: publicProcedure.input(z.object({ path: z.string() })).query(async ({ input }) => {
    if (input.path === '/') {
      return handleSSR({
        meta: {
          title: 'Home',
          description: 'Home page desc',
        },
        initialData: [{ name: 'Paul', age: 20 }],
      });
    }
    if (input.path === '/action') {
      return handleSSR({
        meta: {
          title: 'Action',
        },
        initialData: [{ name: 'Soham Basak', age: 21 }],
      });
    }
  }),
});
