import Link from '@/components/Link';
import { trpc } from '@/lib/trpcClient';
import type { KyrixRouter } from '@/server/trpc/routers/kyrixRouter';

const Home = () => {
  const { data } = trpc.kyrix.ssr.useQuery({ path: '/' });
  const { initialData } = data as KyrixRouter['Home'];

  return (
    <div>
      <h1>tRPC + Vite</h1>

      {initialData.map((item) => (
        <div key={item.name}>
          <p>{item.name}</p>
          <p>{item.age}</p>
        </div>
      ))}

      <Link prefetch='hover' to='/action'>
        Action
      </Link>
    </div>
  );
};

export default Home;
