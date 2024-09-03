import { kyrixRouter } from './routers/kyrixRouter';
import { router } from './trpc';

export const appRouter = router({
  kyrixRouter,
});

export type AppRouter = typeof appRouter;
