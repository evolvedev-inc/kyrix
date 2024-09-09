import type { Metadata, SSRData } from '@kyrix/server';
import { useContext, createContext, useState, useEffect } from 'react';
import { trpc } from 'client/lib/trpcClient.ts';
import { HelmetProvider } from 'react-helmet-async';
import MetadataWrapper from './MetadataWrapper';

export type KyrixContextProviderProps = {
  children: React.ReactNode;
  pathname: string;
  navigate: (href: string) => void;
  caching?: {
    routeDataStaleTime?: number;
    routeDataCacheTime?: number;
  };
};

export type KyrixContext = {
  // As we have defined valid defaults for each property.
  // This will make sure that the user has wrapped their app
  // with kyrix context provider.
  __initialised: boolean;

  updatePageData: (href: string, data: SSRData) => void;
  router: (href: string, navigate: () => void) => void;
  shouldBlock: (nextPathname: string) => boolean;
  isNavigating: boolean;
};

const KyrixContext = createContext<KyrixContext>({
  isNavigating: false,
  router: () => undefined,
  shouldBlock: () => false,
  updatePageData: () => undefined,
  __initialised: false,
});

export const KyrixContextProvider = ({
  children,
  pathname,
  navigate,
  caching: { routeDataStaleTime = Infinity, routeDataCacheTime } = {},
}: KyrixContextProviderProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const trpcCtx = trpc.useUtils();

  const { setData, getData, fetch } = trpcCtx.kyrix.ssr;

  // @ts-expect-error window is not typed with context.
  const initialData = window.__KYRIX_CONTEXT as
    | { url: string; data?: any; meta?: Metadata }
    | undefined;
  if (!initialData) {
    throw new Error(
      'The initial Kyrix context is missing in the server-rendered HTML. Ensure the context is set correctly.'
    );
  }
  setData(
    { path: initialData?.url || pathname },
    { initialData: initialData?.data, meta: initialData?.meta }
  );

  const [currentPageData, setCurrentPageData] = useState<SSRData | undefined>(initialData);

  const shouldBlock = (nextPathname: string): boolean => {
    if (isNavigating) {
      return true;
    }
    const alreadyCached = getData({ path: nextPathname.split('?')[0] });
    if (alreadyCached) {
      setCurrentPageData(alreadyCached);
      return false;
    }
    setNextPath(nextPathname);
    setIsNavigating(true);
    return true;
  };

  useEffect(() => {
    if (nextPath && !isNavigating) {
      navigate(nextPath);
      setNextPath(null);
      return;
    }
    if (nextPath) {
      fetch({ path: nextPath.split('?')[0] })
        .then(setCurrentPageData)
        .finally(() => {
          setIsNavigating(false);
        });
    }
  }, [nextPath, isNavigating, navigate, fetch]);

  const updatePageData = (href: string, data: SSRData) => {
    setData({ path: href }, { meta: data.meta, initialData: data.initialData });
    setCurrentPageData(data);
  };

  const router: KyrixContext['router'] = (href, navigate) => {
    if (isNavigating) return;

    setIsNavigating(true);

    trpcCtx.kyrix.ssr
      .fetch(
        { path: href },
        {
          retry: (count, err) => err.data?.code !== 'NOT_FOUND' && count <= 2,
          staleTime: routeDataStaleTime,
          cacheTime: routeDataCacheTime,
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
          shouldBlock,
          isNavigating,
          __initialised: true,
        }}
      >
        <MetadataWrapper meta={currentPageData} />
        {children}
      </KyrixContext.Provider>
    </HelmetProvider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useKyrixContext = () => {
  const context = useContext(KyrixContext);
  if (!context.__initialised) throw new Error('Wrap your application with Kyrix Context Provider.');

  return context;
};
