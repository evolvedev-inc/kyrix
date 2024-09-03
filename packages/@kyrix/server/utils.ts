import { SSRData } from './config';

export const handleSSR = ({ meta, initialData }: SSRData) => {
  // Do something before returning if necessary.
  return {
    meta,
    initialData,
  };
};
