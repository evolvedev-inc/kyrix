import { Helmet } from 'react-helmet-async';
import { SSRData } from '@kyrix/server';

const MetadataWrapper = ({ meta: data }: { meta?: SSRData }) => {
  return (
    <Helmet>
      {data?.meta?.title && <title>{data.meta.title}</title>}
      {data?.meta?.description && <meta name='description' content={data.meta.description} />}
      {data?.meta?.keywords && <meta name='keywords' content={data.meta.keywords} />}
      {data?.meta?.author && <meta name='author' content={data.meta.author} />}
      {data?.meta?.ogTitle && <meta property='og:title' content={data.meta.ogTitle} />}
      {data?.meta?.ogDescription && (
        <meta property='og:description' content={data.meta.ogDescription} />
      )}
      {data?.meta?.ogImage && <meta property='og:image' content={data.meta.ogImage} />}
      {data?.meta?.ogUrl && <meta property='og:url' content={data.meta.ogUrl} />}
      {data?.meta?.twitterTitle && <meta name='twitter:title' content={data.meta.twitterTitle} />}
      {data?.meta?.twitterDescription && (
        <meta name='twitter:description' content={data.meta.twitterDescription} />
      )}
      {data?.meta?.twitterImage && <meta name='twitter:image' content={data.meta.twitterImage} />}
      {data?.meta?.twitterCard && <meta name='twitter:card' content={data.meta.twitterCard} />}
      {data?.meta?.jsonLd && (
        <script type='application/ld+json'>{JSON.stringify(data.meta.jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default MetadataWrapper;
