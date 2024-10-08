import type { KyrixMiddlewareConfig } from './config';
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import fs from 'fs/promises';
import mime from 'mime';

import { convertMetadataToHTML, type Metadata } from './metadata';

export type Middleware = (req: IncomingMessage, res: ServerResponse, next: NextFunction) => void;

export type NextFunction = (err?: any) => void;

// To chain middlewares
export const execMiddlewares = (
  req: IncomingMessage,
  res: ServerResponse,
  middlewares: Middleware[],
  next: (req: IncomingMessage, res: ServerResponse) => void
) => {
  const nextMiddleware = middlewares.shift();

  if (nextMiddleware) {
    nextMiddleware(req, res, (err) => {
      if (err) {
        console.error('Middleware error:', err);
        res.statusCode = 500;
        return res.end('Internal Server Error');
      } else {
        return execMiddlewares(req, res, middlewares, next);
      }
    });
  } else {
    return next(req, res);
  }
};

export const logger =
  ({ port, verbose = false }: { port: number; verbose?: boolean }) =>
  (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    const url = new URL(`http://localhost:${port}${req.url || '/'}`);
    if (verbose) {
      console.log(`Incoming Request on ${decodeURI(url.pathname)} - Status: ${res.statusCode}`);
    } else if (url.pathname.startsWith('/api')) {
      console.log(`Incoming API Request on ${decodeURI(url.pathname)} - Status: ${res.statusCode}`);
    }
    next?.();
  };

export const serveBuild =
  ({
    root,
    isProduction,
    ssrData: data,
  }: {
    root: string;
    isProduction: boolean;
    ssrData?: { initialData?: any; meta?: Metadata };
  }) =>
  async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const requestedPath = path.join(root, 'dist', 'client', req.url ?? 'index.html');
      const file = await fs.readFile(requestedPath, {
        encoding: 'utf-8',
      });

      const fileExt = path.extname(requestedPath);
      const mimeType = mime.getType(fileExt.slice(1));

      res.appendHeader('Content-Type', mimeType ?? 'text/plain');
      res.end(file);
    } catch {
      try {
        const indexHTML = await fs.readFile(path.join(root, 'dist', 'client', 'index.html'), {
          encoding: 'utf-8',
        });

        const headHTML = data ? convertMetadataToHTML(data.meta) : '';
        const modifiledIndexHTML = indexHTML.replace('<!-- app-meta -->', headHTML.trim()).replace(
          '<!-- app-context -->',
          `<script>window.__KYRIX_CONTEXT = ${JSON.stringify({
            url: req.url ?? '/',
            data: data?.initialData,
            meta: data?.meta,
          })}</script>`
        );

        res.setHeader('Content-Type', 'text/html');
        res.end(modifiledIndexHTML);
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end(`Internal Server Error ${!isProduction ? err : undefined}`);
      }
    }
  };

export const createKyrixMiddleware =
  ({ isProduction, root, viteServer: vite, ...opts }: KyrixMiddlewareConfig) =>
  async (req: IncomingMessage, res: ServerResponse) => {
    if (!isProduction) {
      if (!vite) {
        throw new Error('Currently in development mode but failed to initialize vite server');
      }

      vite.middlewares(req, res, async () => {
        try {
          const indexHTML = await fs.readFile(path.join(root, 'index.html'), {
            encoding: 'utf8',
          });

          // Modifying the HTML shell and injecting the meta and initial data.
          const headHTML = opts.ssrData ? convertMetadataToHTML(opts.ssrData.meta) : '';
          const modifiledIndexHTML = indexHTML
            .replace('<!-- app-meta -->', headHTML.trim())
            .replace(
              '<!-- app-context -->',
              `<script>window.__KYRIX_CONTEXT = ${JSON.stringify({
                url: req.url ?? '/',
                data: opts.ssrData?.initialData,
                meta: opts.ssrData?.meta,
              })}</script>`
            );

          res.setHeader('Content-Type', 'text/html');
          res.end(modifiledIndexHTML);
        } catch (err) {
          console.error(err);

          // If failed to serve index.html, it'll be a fatal error.
          res.statusCode = 500;
          res.end(`Internal Server Error ${err}`);
          return;
        }
      });
    } else {
      // In Production, we serve the static files generated by vite like *.js, *.css,
      // from the dist/client directory but take care of the index.html ourselves.
      // We check the path for every request and try to match with any static files
      // in dist/client directory, if matches that file is sent else index.html is served.
      // This ensures the client-side router takes over after javascript loads.
      const serve = serveBuild({ root, isProduction, ssrData: opts.ssrData });
      return serve(req, res);
    }
  };
