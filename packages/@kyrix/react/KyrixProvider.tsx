import type { Metadata } from '@kyrix/server';
import { useEffect, useCallback, useMemo, useState, useContext, createContext } from 'react';
import type { NavigateOptions, NavigateFunction } from 'react-router-dom';
import { trpc } from '../../../src/lib/trpcClient';

export type KyrixContextProviderProps = {
  children: React.ReactNode;
  navigate: NavigateFunction;
};

export type CachedRoute = {
  url: string;
  meta?: Partial<Metadata>;
  initialData?: any;
};
export type KyrixContext = {
  currentRoute: CachedRoute;
  cachedRoutes: Map<string, CachedRoute>;
  handleNavigation: (
    href: string,
    data: KyrixContext['currentRoute'],
    opts: NavigateOptions
  ) => void;
};

const cachedRouteInitial: CachedRoute = {
  url: '',
  meta: undefined,
  initialData: undefined,
};

const cachedRoutesInitial: KyrixContext['cachedRoutes'] = new Map<string, CachedRoute>();

const KyrixContext = createContext<KyrixContext>({
  cachedRoutes: new Map<string, CachedRoute>(),
  currentRoute: cachedRouteInitial,
  handleNavigation: () => undefined,
});

export const KyrixContextProvider = ({ children, navigate }: KyrixContextProviderProps) => {
  const [currentRoute, setCurrentRoute] = useState<CachedRoute>(cachedRouteInitial);
  const [cachedRoutes, setCachedRoutes] =
    useState<KyrixContext['cachedRoutes']>(cachedRoutesInitial);
  const trpcCtx = trpc.useUtils();

  const { setData } = trpcCtx.kyrixRouter.ssr;

  useEffect(() => {
    // @ts-expect-error window is not typed with kyrix context.
    const ctx = window.__KYRIX_CONTEXT as { url: string; data?: any } | undefined;
    if (typeof ctx === 'undefined') {
      throw new Error(
        'The initial Kyrix context is missing in the server-rendered HTML. Ensure the context is set correctly.'
      );
    }
    setCurrentRoute(ctx);
    setData({ path: ctx.url }, ctx.data);
    setCachedRoutes((prev) => new Map(prev).set(ctx.url, ctx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigation = useCallback(
    (href: string, data: KyrixContext['currentRoute'], opts: NavigateOptions) => {
      // if (cachedRoutes.has(href)) {
      //         setCurrentRoute(data);
      //         setCachedRoutes((prev) => new Map(prev).set(href, data));
      //         navigate(href, opts);
      // }

      setCurrentRoute(data);
      setCachedRoutes((prev) => new Map(prev).set(href, data));
      navigate(href, opts);
    },
    [navigate]
  );

  const values = useMemo(
    () => ({
      cachedRoutes,
      currentRoute,
      handleNavigation,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cachedRoutes, currentRoute]
  );

  return <KyrixContext.Provider value={values}>{children}</KyrixContext.Provider>;
};

export const useKyrixContext = () => {
  const context = useContext(KyrixContext);
  if (context === undefined) throw new Error('Wrap your application with Kyrix Context Provider.');

  return context;
};
