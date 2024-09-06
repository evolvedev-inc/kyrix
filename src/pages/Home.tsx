import Link from '@/components/Link';
import { trpc } from '@/lib/trpcClient';
import { KyrixRouter } from '@/server/trpc/routers/kyrixRouter';

const Home = () => {
  const { data } = trpc.kyrix.ssr.useQuery({ path: '/' });
  const initialData = data as KyrixRouter['test'];

  return (
    <div>
      <h1>tRPC + Vite</h1>

      {JSON.stringify(data)}

      <Link prefetch='hover' state={initialData} to='/action'>
        Action
      </Link>
    </div>
  );
};

export default Home;
