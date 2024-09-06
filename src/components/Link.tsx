import { Link as RouterLink, type LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import { useNavigate } from '@/hooks/useNavigate';
import { trpc } from '@/lib/trpcClient';

type LinkProps = ReactRouterLinkProps & {
  prefetch?: ('hover' | 'viewport') | false;
};

// Make sure to use this Link component for correct metadata and
// page initial data updates.

// This link can be customised with any choice of router.

// If any change needed, first modify the useNavigate hook.
// Then swap the RouterLink component with the link from your
// choice of router.
export default function Link({
  to,
  preventScrollReset,
  relative,
  state,
  replace,
  prefetch = false,
  unstable_viewTransition,
  ...props
}: LinkProps) {
  const navigate = useNavigate();
  const trpcCtx = trpc.useUtils();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to, {
      preventScrollReset,
      relative,
      state,
      replace,
      unstable_viewTransition,
    });
  };

  const onHover = async () => {
    if (prefetch === false) return;

    if (prefetch === 'hover') {
      await trpcCtx.kyrix.ssr.prefetch(
        { path: to.toString().split('?')[0] },
        {
          retry: false,
        }
      );
    }
  };

  return <RouterLink onClick={handleClick} onMouseEnter={onHover} to={to} {...props} />;
}
