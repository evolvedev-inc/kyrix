import type { KyrixRouter } from '@/server/trpc/routers/kyrixRouter';

import { trpc } from '@/lib/trpcClient';

const Home = () => {
  const { data } = trpc.kyrix.ssr.useQuery({ path: '/' });
  const { initialData } = data as KyrixRouter['Home'];

  return (
    <div>
      <h1>Kyrix = tRPC + Vite</h1>

      {initialData}
    </div>
  );
};

export default Home;
