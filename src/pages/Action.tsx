import Link from '@/components/Link';
import { useKyrixContext } from '@kyrix/react/KyrixProvider';

const Action = () => {
  const { currentPageData: data } = useKyrixContext();

  return (
    <div>
      {JSON.stringify(data)}
      <Link to='/'>Go Home</Link>
    </div>
  );
};

export default Action;
