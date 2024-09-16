import { builtinModules } from 'module';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        server: path.resolve(__dirname, 'src/server/main.ts'), // Server entry point
      },
      output: {
        format: 'cjs',
        dir: path.resolve(__dirname, 'dist/server'),
      },
    },
    ssr: true,
    copyPublicDir: false,
  },
  ssr: {
    external: [
      ...builtinModules,
      ...builtinModules.map((m) => `node:${m}`),
      // Make sure to exclude vite and react plugin from the final server bundle
      // as they're not required in production stage.
      'vite',
      '@vitejs/plugin-react-swc',
    ],
    noExternal: process.env.NODE_ENV === 'production' ? [/.*/] : [],
  },
});
