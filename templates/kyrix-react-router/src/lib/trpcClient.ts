import type { AppRouter } from '../server/trpc/root';

import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
