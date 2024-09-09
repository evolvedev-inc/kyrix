import Link from '@/components/Link';
import { trpc } from '@/lib/trpcClient';
import { KyrixRouter } from '@/server/trpc/routers/kyrixRouter';

const Action = () => {
  const { data } = trpc.kyrix.ssr.useQuery({ path: '/action' });
  const { initialData } = data as KyrixRouter['Action'];

  return (
    <div>
      {initialData.map((i) => (
        <div key={i.name}>
          <p>{i.name}</p>
          <p>{i.age}</p>
        </div>
      ))}
      <Link prefetch='hover' to='/'>
        Go Home
      </Link>
    </div>
  );
};

export default Action;
