import { kyrixRouter } from './routers/kyrixRouter';
import { router } from './trpc';

export const appRouter = router({
  kyrix: kyrixRouter,
});

export type AppRouter = typeof appRouter;
