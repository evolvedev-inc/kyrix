export const convertMetadataToHTML = (meta?: Partial<Metadata>) => {
  return `
    ${meta?.title ? `<title>${meta.title}</title>` : ''}
    ${
      meta?.description
        ? `<meta name="description" content="${meta.description}" data-rh="true">`
        : ''
    }
  `;
};

export type Metadata = {
  title: string;
  description: string;
};
