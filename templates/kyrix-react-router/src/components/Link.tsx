import { Link as RouterLink, type LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { type LinkArgs, useLink } from '@kyrix/react/hooks';

type LinkProps = ReactRouterLinkProps & {
  prefetch?: LinkArgs['prefetch'];
};

// Make sure to use this Link component for getting additional features like prefetch.
// This link can be customised with any choice of router.

// If any change needed, swap your router's link with RouterLink.
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
  const { onHover } = useLink();

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

  return (
    <RouterLink
      onClick={handleClick}
      onMouseEnter={() => onHover({ href: to.toString(), prefetch })}
      to={to}
      {...props}
    />
  );
}
