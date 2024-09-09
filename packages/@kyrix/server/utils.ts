import { SSRData } from './config';

export type KyrixSSRHandlerReturnType = {
  meta?: NonNullable<SSRData['meta']>;
  initialData?: SSRData['initialData'];
};

export type KyrixSSRHandler<T> = (
  ctx: T,
  params: Record<string, any>
) => Promise<KyrixSSRHandlerReturnType> | KyrixSSRHandlerReturnType;

export type SSRRoute<T> = {
  id: string;
  path: string;
  handler: KyrixSSRHandler<T>;
};

export const handleSSR = <T = any>({ meta, initialData }: SSRData<T>) => {
  // Do something before returning if necessary.

  return {
    meta,
    initialData,
  };
};
