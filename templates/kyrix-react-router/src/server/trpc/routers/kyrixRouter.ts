import { publicProcedure, router, TRPCContext } from '../trpc';
import { match } from 'path-to-regexp';
import { ssrRoutes } from '../../SSR';
import type { KyrixSSRHandler as KyrixSSRHandlerType } from '@kyrix/server';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

type SSRRouteDefinitions = typeof ssrRoutes;

type KyrixSSRHandler = KyrixSSRHandlerType<TRPCContext>;

type SSRRouteHandlerReturnType<T> = T extends { handler: (...args: any[]) => infer R } ? R : never;

export type KyrixRouter = {
  [ID in SSRRouteDefinitions[number]['id']]: Awaited<
    SSRRouteHandlerReturnType<Extract<SSRRouteDefinitions[number], { id: ID }>>
  > extends { meta: infer M; initialData?: infer D }
    ? D extends undefined
      ? { meta: M }
      : { meta: M; initialData: D }
    : never;
};

export const kyrixRouter = router({
  ssr: publicProcedure.input(z.object({ path: z.string() })).query(async ({ input, ctx }) => {
    try {
      let params: Record<string, any> = {};

      const matchedRoute = ssrRoutes.find((route) => {
        const matcher = match(route.path, { decode: decodeURIComponent });
        const result = matcher(input.path);

        params = result ? result.params : {};
        return result ? route : false;
      });

      if (matchedRoute) {
        const data = await (matchedRoute.handler as KyrixSSRHandler)(ctx, params);
        return data;
      }
    } catch (err) {
      console.error(`Error in KyrixRouter for ${input.path} - ${err}`);

      if (!(err instanceof TRPCError)) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error has occurred.',
        });
      }

      throw err;
    }

    return {
      meta: {
        title: 'Not Found',
        description: 'This page could not be found.',
      },
    };
  }),
});
