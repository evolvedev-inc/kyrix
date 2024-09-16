import { trpc } from '../../../../src/lib/trpcClient';

export type LinkArgs = {
  href: string;
  prefetch?: ('hover' | 'viewport') | false;
};

export const useLink = () => {
  const trpcCtx = trpc.useUtils();

  const onHover = async ({ href, prefetch }: LinkArgs) => {
    if (prefetch === false) return;

    if (prefetch === 'hover') {
      await trpcCtx.kyrix.ssr.prefetch(
        { path: href.split('?')[0] },
        {
          retry: (num, err) => {
            // Check for 404 or 401 errors and do not retry if these errors occur
            if (err.data?.httpStatus === 404 || err.data?.httpStatus === 401) {
              return false;
            }
            // Retry up to twice for other errors
            return num < 2;
          },
        }
      );
    }
  };

  return { onHover };
};
