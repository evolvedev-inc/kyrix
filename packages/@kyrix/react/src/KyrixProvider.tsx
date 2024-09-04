import type { Metadata } from '@kyrix/server';
import { useContext, createContext, useState, useEffect } from 'react';
import { trpc } from 'client/lib/trpcClient.ts';

export type KyrixContextProviderProps = {
  children: React.ReactNode;
  location: string;
  caching?: {
    strategy?: 'in-memory';
    routeDataStaleTime?: number;
    routeDataCacheTime?: number;
  };
};

export type RouteData = {
  meta: Partial<Metadata>;
  initialData?: any;
};

export type KyrixContext = {
  updatePageData: (href: string, data: RouteData) => void;
  router: (href: string, navigate: () => void) => void;
  isNavigating: boolean;
};

const KyrixContext = createContext<KyrixContext>({
  updatePageData: () => undefined,
  router: () => () => undefined,
  isNavigating: false,
});

export const KyrixContextProvider = ({
  children,
  location,
  caching: { routeDataStaleTime = Infinity, routeDataCacheTime } = {},
}: KyrixContextProviderProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const trpcCtx = trpc.useUtils();

  const { setData, getData, prefetch } = trpcCtx.kyrixRouter.ssr;

  // @ts-expect-error window is not typed with kyrix context.
  const ctx = window.__KYRIX_CONTEXT;
  if (!ctx) {
    throw new Error(
      'The initial Kyrix context is missing in the server-rendered HTML. Ensure the context is set correctly.'
    );
  }
  setData({ path: ctx.url }, { meta: {}, initialData: ctx.data });

  useEffect(() => {
    (async function () {
      const cachedRouteData = getData({ path: location });
      if (cachedRouteData?.meta || cachedRouteData?.initialData) {
        setData({ path: location }, cachedRouteData);
      } else {
        await prefetch(
          { path: location },
          { staleTime: routeDataStaleTime, cacheTime: routeDataCacheTime }
        );
      }
    })();
  }, [location]);

  const updatePageData = (href: string, data: RouteData) => {
    setData({ path: href }, { meta: data.meta, initialData: data.initialData });
  };

  const router: KyrixContext['router'] = (href, navigate) => {
    if (isNavigating) return () => undefined;

    setIsNavigating(true);

    trpcCtx.kyrixRouter.ssr
      .prefetch(
        { path: href },
        {
          retry: (count, err) => err.data?.code !== 'NOT_FOUND' && count <= 2,
          staleTime: Infinity,
        }
      )
      .finally(() => {
        setIsNavigating(false);
        navigate();
      });
  };
  return (
    <KyrixContext.Provider
      value={{
        updatePageData,
        router,
        isNavigating,
      }}
    >
      {children}
    </KyrixContext.Provider>
  );
};

export const useKyrixContext = () => {
  const context = useContext(KyrixContext);
  if (context === undefined) throw new Error('Wrap your application with Kyrix Context Provider.');

  return context;
};
