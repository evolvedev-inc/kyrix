import { trpc } from '../lib/trpcClient';

const Action = () => {
  const data = trpc.kyrixRouter.ssr.useQuery({ path: '/action' });

  return <div>{JSON.stringify(data.data)}</div>;
};

export default Action;
