import type { ViteDevServer } from 'vite';
import type { Metadata } from './metadata';

export type SSRData<T = any> = {
  meta?: Metadata;
  initialData?: T | undefined;
};

export type KyrixMiddlewareConfig = {
  root: string;
  isProduction: boolean;
  port: number;
  viteServer?: ViteDevServer;
  ssrData?: SSRData;
};
