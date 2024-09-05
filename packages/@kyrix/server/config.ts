import type { ViteDevServer } from 'vite';
import type { Metadata } from './metadata';

export type SSRData<T = any> = {
  meta?: Partial<Metadata>;
  initialData?: T;
};

export type KyrixMiddlewareConfig = {
  root: string;
  isProduction: boolean;
  port: number;
  viteServer?: ViteDevServer;
  ssrData?: SSRData;
};
