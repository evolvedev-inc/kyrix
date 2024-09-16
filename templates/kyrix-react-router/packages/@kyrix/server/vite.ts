import type { InlineConfig } from 'vite';

export const createViteDevServer = async ({
  port,
  ...opts
}: {
  viteConfig?: InlineConfig;
  port: number;
}) => {
  const { createServer } = await import('vite');
  return createServer({
    appType: 'custom',
    server: {
      port,
      hmr: false,
      middlewareMode: true,
    },
    ...opts.viteConfig,
  });
};
