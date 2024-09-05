import { Helmet } from 'react-helmet-async';
import { RouteData } from './KyrixProvider';

const MetadataWrapper = ({ data }: { data?: RouteData }) => {
  return (
    <Helmet>
      {data?.meta?.title && <title>{data.meta.title}</title>}
      {data?.meta?.description && <meta name='description' content={data.meta.description} />}
    </Helmet>
  );
};

export default MetadataWrapper;
