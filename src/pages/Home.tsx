import Link from '@/components/Link';
import { trpc } from '@/lib/trpcClient';

const Home = () => {
  const { data } = trpc.kyrix.ssr.useQuery({ path: '/' });

  return (
    <div>
      <h1>tRPC + Vite</h1>

      {JSON.stringify(data)}

      <Link state={data?.initialData} to='/action'></Link>
    </div>
  );
};

export default Home;
