import Link from '@kyrix/react/Link';
import { trpc } from './lib/trpcClient';

const Home = () => {
  const { data } = trpc.kyrixRouter.ssr.useQuery(
    { path: '/' },
    {
      enabled: false,
    }
  );

  return (
    <div>
      <h1>tRPC + Vite</h1>

      {JSON.stringify(data)}

      <Link href='/action'>go</Link>
    </div>
  );
};

export default Home;
