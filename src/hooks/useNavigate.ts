import { useKyrixContext } from '@kyrix/react/KyrixProvider';
import {
  type NavigateOptions,
  type NavigateProps,
  useNavigate as useRouterNavigate,
} from 'react-router-dom';

// Make sure to use this navigate function only for correct metadata and
// page initial data updates.

// If any change needed, first modify the useNavigate hook to return
// the same function signature of your router's navigate(or something similar)
// function then, use the router function provided by kyrix context
// which takes a path or href without any query string eg -> '/path'.
// In second argument pass your router's navigate function passing the
// required paramaters.
export const useNavigate = () => {
  const { router } = useKyrixContext();
  const navigate = useRouterNavigate();

  return (to: NavigateProps['to'], opts?: NavigateOptions) => {
    router(to.toString().split('?')[0], () => navigate(to, opts));
  };
};
