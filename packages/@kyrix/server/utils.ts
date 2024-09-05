import { SSRData } from './config';

export const handleSSR = <T>({ meta, initialData }: SSRData<T>) => {
  // Do something before returning if necessary.
  return {
    meta,
    initialData,
  };
};
