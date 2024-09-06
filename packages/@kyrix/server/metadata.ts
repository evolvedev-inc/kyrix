export type Metadata = {
  // Standard metadata
  title: string;
  description: string;
  keywords?: string;
  author?: string;

  // Open Graph metadata (for social media)
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string; // e.g., 'website', 'article'
  ogSiteName?: string;

  // Twitter metadata
  twitterCard?: string; // e.g., 'summary', 'summary_large_image'
  twitterSite?: string; // @username for the site
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string; // Twitter image URL

  // Facebook-specific metadata
  fbAppId?: string; // Facebook App ID

  // Link tags
  canonicalUrl?: string;
  iconUrl?: string; // favicon link
  appleTouchIconUrl?: string; // for iOS home screen

  // Structured data (JSON-LD)
  jsonLd?: Record<string, any>; // JSON-LD structured data
};

export const convertMetadataToHTML = (meta?: Metadata) => {
  return `
        ${meta?.title ? `<title data-rh="true">${meta.title}</title>` : ''}
    ${
      meta?.description
        ? `<meta name="description" content="${meta.description}" data-rh="true">`
        : ''
    }
    ${meta?.keywords ? `<meta name="keywords" content="${meta.keywords}" data-rh="true">` : ''}
    ${meta?.author ? `<meta name="author" content="${meta.author}" data-rh="true">` : ''}
    ${meta?.ogTitle ? `<meta property="og:title" content="${meta.ogTitle}" data-rh="true">` : ''}
    ${
      meta?.ogDescription
        ? `<meta property="og:description" content="${meta.ogDescription}" data-rh="true">`
        : ''
    }
    ${meta?.ogImage ? `<meta property="og:image" content="${meta.ogImage}" data-rh="true">` : ''}
    ${meta?.ogUrl ? `<meta property="og:url" content="${meta.ogUrl}" data-rh="true">` : ''}
    ${
      meta?.twitterTitle
        ? `<meta name="twitter:title" content="${meta.twitterTitle}" data-rh="true">`
        : ''
    }
    ${
      meta?.twitterDescription
        ? `<meta name="twitter:description" content="${meta.twitterDescription}" data-rh="true">`
        : ''
    }
    ${
      meta?.twitterImage
        ? `<meta name="twitter:image" content="${meta.twitterImage}" data-rh="true">`
        : ''
    }
    ${
      meta?.twitterCard
        ? `<meta name="twitter:card" content="${meta.twitterCard}" data-rh="true">`
        : ''
    }
    ${
      meta?.jsonLd
        ? `<script type="application/ld+json" data-rh="true">${JSON.stringify(
            meta.jsonLd
          )}</script>`
        : ''
    }
  `;
};
