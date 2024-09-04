import type { Metadata } from '@kyrix/server';
import { useContext, createContext, useState, useEffect } from 'react';
import { trpc } from 'client/lib/trpcClient.ts';
import { Helmet, HelmetProvider } from 'react-helmet-async';

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
  meta?: Partial<Metadata>;
  initialData?: any;
};

export type KyrixContext = {
  updatePageData: (href: string, data: RouteData) => void;
  router: (href: string, navigate: () => void) => void;
  currentPageData?: RouteData;
  isNavigating: boolean;
};

const KyrixContext = createContext<KyrixContext>({
  updatePageData: () => undefined,
  router: () => undefined,
  isNavigating: false,
});

export const KyrixContextProvider = ({
  children,
  location,
  caching: { routeDataStaleTime = Infinity, routeDataCacheTime } = {},
}: KyrixContextProviderProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const trpcCtx = trpc.useUtils();

  const { setData, getData, fetch } = trpcCtx.kyrixRouter.ssr;

  // @ts-expect-error window is not typed with context.
  const initialData = window.__KYRIX_CONTEXT as
    | { url: string; data?: any; meta?: Partial<Metadata> }
    | undefined;
  setData(
    { path: initialData?.url || '/' },
    { initialData: initialData?.data, meta: initialData?.meta }
  );

  const [currentPageData, setCurrentPageData] = useState<RouteData | undefined>(initialData);

  useEffect(() => {
    (async function () {
      const cachedRouteData = getData({ path: location });
      if (cachedRouteData?.meta || cachedRouteData?.initialData) {
        setData({ path: location }, cachedRouteData);
        setCurrentPageData(cachedRouteData);
      } else {
        const data = await fetch(
          { path: location },
          { staleTime: routeDataStaleTime, cacheTime: routeDataCacheTime }
        );
        setCurrentPageData(data);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const updatePageData = (href: string, data: RouteData) => {
    setData({ path: href }, { meta: data.meta, initialData: data.initialData });
    setCurrentPageData(data);
  };

  const router: KyrixContext['router'] = (href, navigate) => {
    if (isNavigating) return;

    setIsNavigating(true);

    trpcCtx.kyrixRouter.ssr
      .fetch(
        { path: href },
        {
          retry: (count, err) => err.data?.code !== 'NOT_FOUND' && count <= 2,
          staleTime: Infinity,
        }
      )
      .then(setCurrentPageData)
      .finally(() => {
        setIsNavigating(false);
        navigate();
      });
  };

  return (
    <HelmetProvider>
      <KyrixContext.Provider
        value={{
          updatePageData,
          router,
          isNavigating,
          currentPageData,
        }}
      >
        {children}
        <Helmet>
          <title>{currentPageData?.meta?.title}</title>
          <meta name='description' content={currentPageData?.meta?.description} />
        </Helmet>
      </KyrixContext.Provider>
    </HelmetProvider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useKyrixContext = () => {
  const context = useContext(KyrixContext);
  if (context === undefined) throw new Error('Wrap your application with Kyrix Context Provider.');

  return context;
};
