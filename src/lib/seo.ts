interface SEOMetaTags {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Generate SEO meta tags for a page
 */
export const generateSEOTags = (meta: SEOMetaTags) => {
  const tags: Record<string, string> = {};
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://your-domain.com';

  // Basic meta tags
  tags['title'] = meta.title;
  tags['description'] = meta.description;
  if (meta.keywords) tags['keywords'] = meta.keywords;

  // Open Graph tags
  tags['og:title'] = meta.title;
  tags['og:description'] = meta.description;
  tags['og:type'] = meta.type || 'website';
  tags['og:url'] = meta.url || baseUrl;
  if (meta.image) tags['og:image'] = meta.image;
  tags['og:site_name'] = 'OT-OnlyThing';

  // Twitter Card tags
  tags['twitter:card'] = 'summary_large_image';
  tags['twitter:title'] = meta.title;
  tags['twitter:description'] = meta.description;
  if (meta.image) tags['twitter:image'] = meta.image;

  // Article specific tags
  if (meta.type === 'article') {
    if (meta.author) tags['article:author'] = meta.author;
    if (meta.publishedTime) tags['article:published_time'] = meta.publishedTime;
    if (meta.modifiedTime) tags['article:modified_time'] = meta.modifiedTime;
  }

  // Product specific tags
  if (meta.type === 'product') {
    tags['og:type'] = 'product';
  }

  return tags;
};

/**
 * Update document meta tags
 */
export const updateMetaTags = (tags: Record<string, string>) => {
  Object.entries(tags).forEach(([key, value]) => {
    if (key === 'title') {
      document.title = value;
      return;
    }

    let element = document.querySelector(`meta[name="${key}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.querySelector(`meta[property="${key}"]`) as HTMLMetaElement;
    }

    if (element) {
      element.content = value;
    } else {
      const newElement = document.createElement('meta');
      if (key.startsWith('og:') || key.startsWith('article:')) {
        newElement.setAttribute('property', key);
      } else {
        newElement.setAttribute('name', key);
      }
      newElement.content = value;
      document.head.appendChild(newElement);
    }
  });
};

/**
 * Generate JSON-LD structured data for a product
 */
export const generateProductSchema = (product: {
  name: string;
  description?: string;
  image?: string;
  price: number;
  currency?: string;
  sku?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
}) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: product.image || '',
    sku: product.sku || '',
    brand: {
      '@type': 'Brand',
      name: product.brand || 'OT-OnlyThing',
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: product.currency || 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
      },
    }),
  };
};

/**
 * Generate JSON-LD structured data for organization
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OT-OnlyThing',
    url: import.meta.env.VITE_APP_URL || 'https://your-domain.com',
    logo: `${import.meta.env.VITE_APP_URL}/logo.png`,
    description: 'Premium e-commerce platform for quality products',
    sameAs: [
      'https://facebook.com/your-page',
      'https://twitter.com/your-handle',
      'https://instagram.com/your-profile',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-1234567890',
      contactType: 'Customer Service',
      email: 'support@your-domain.com',
    },
  };
};

/**
 * Inject JSON-LD script into page
 */
export const injectStructuredData = (data: object) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};