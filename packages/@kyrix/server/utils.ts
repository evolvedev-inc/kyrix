import { SSRData } from './config';

export type KyrixSSRHandlerReturnType = {
  meta?: NonNullable<SSRData['meta']>;
  initialData?: SSRData['initialData'];
};

export type KyrixSSRHandler<T> = (
  ctx: T,
  params: Record<string, string>
) => Promise<KyrixSSRHandlerReturnType> | KyrixSSRHandlerReturnType;

export type SSRRoute<T> = {
  id: string;
  path: string;
  handler: KyrixSSRHandler<T>;
};
