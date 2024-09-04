import { useKyrixContext } from '@kyrix/react/KyrixProvider';
import {
  type NavigateOptions,
  type NavigateProps,
  useNavigate as useRouterNavigate,
} from 'react-router-dom';

export const useNavigate = () => {
  const { router } = useKyrixContext();
  const navigate = useRouterNavigate();

  return (to: NavigateProps['to'], opts?: NavigateOptions) => {
    router(to.toString().split('?')[0], () => navigate(to, opts));
  };
};
