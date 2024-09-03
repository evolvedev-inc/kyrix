import type { ViteDevServer } from 'vite';
import type { Metadata } from './metadata';

export type SSRData = {
  meta: Partial<Metadata>;
  initialData?: any;
};

export type KyrixMiddlewareConfig = {
  root: string;
  isProduction: boolean;
  port: number;
  viteServer?: ViteDevServer;
  ssrData?: SSRData;
};
