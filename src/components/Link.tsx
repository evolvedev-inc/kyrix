import { Link as RouterLink, type LinkProps } from 'react-router-dom';
import { useNavigate } from '@/hooks/useNavigate';

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
  unstable_viewTransition,
  ...props
}: LinkProps) {
  const navigate = useNavigate();

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

  return <RouterLink onClick={handleClick} to={to} {...props} />;
}
