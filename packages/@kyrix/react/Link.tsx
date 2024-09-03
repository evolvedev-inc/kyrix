import { useRef } from 'react';
import { trpc } from '../../../src/lib/trpcClient';
import { useKyrixContext } from './KyrixProvider';
import type { NavigateOptions } from 'react-router-dom';

export type LinkProps = JSX.IntrinsicElements['a'] & NavigateOptions;

export default function Link({
  href,
  preventScrollReset,
  relative,
  replace,
  state,
  unstable_flushSync,
  unstable_viewTransition,
  ...props
}: LinkProps) {
  const kyrixContext = useKyrixContext();
  const context = trpc.useUtils();
  const isNavigating = useRef(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!href) {
      console.log('You forgot to pass the href prop');
      return;
    }
    if (isNavigating.current) return;

    try {
      isNavigating.current = true;
      const data = await context.kyrixRouter.ssr.fetch(
        { path: href },
        { retry: 2, staleTime: Infinity }
      );

      kyrixContext.handleNavigation(
        href,
        {
          url: href,
          ...data,
        },
        {
          preventScrollReset,
          relative,
          replace,
          state,
          unstable_flushSync,
          unstable_viewTransition,
        }
      );
    } finally {
      isNavigating.current = false;
    }
  };

  return <a onClick={handleClick} href={href} {...props} />;
}
