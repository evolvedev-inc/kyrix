import { Link as RouterLink, type LinkProps } from 'react-router-dom';
import { useNavigate } from '@/hooks/useNavigate';

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
