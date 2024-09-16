import type { ServerResponse } from 'http';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime';

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

export async function serveStatic(res: ServerResponse, absolutePath: string) {
  try {
    const filePath = path.resolve(process.cwd(), absolutePath);
    const file = await fs.readFile(filePath, {
      encoding: 'utf-8',
    });

    const fileExt = path.extname(filePath);
    const mimeType = mime.getType(fileExt.slice(1));

    res.appendHeader('Content-Type', mimeType ?? 'text/plain');
    res.end(file);
  } catch (err) {
    console.error('Error:', err);
  }
}
