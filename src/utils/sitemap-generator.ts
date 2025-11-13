/**
 * Sitemap Generator Utility
 * Run this script to generate sitemap.xml
 */

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (urls: SitemapUrl[]): string => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://your-domain.com';
  
  const urlEntries = urls.map((url) => `
  <url>
    <loc>${baseUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

// Static pages sitemap data
export const staticPages: SitemapUrl[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/shop', changefreq: 'daily', priority: 0.9 },
  { loc: '/about', changefreq: 'monthly', priority: 0.7 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.6 },
  { loc: '/blog', changefreq: 'weekly', priority: 0.8 },
  { loc: '/faq', changefreq: 'monthly', priority: 0.5 },
  { loc: '/science', changefreq: 'monthly', priority: 0.6 },
];

/**
 * Generate dynamic sitemap including products and blog posts
 * This should be run server-side or as a build step
 */
export const generateDynamicSitemap = async () => {
  const urls: SitemapUrl[] = [...staticPages];
  
  // Add product pages
  // Fetch from your database
  // const products = await fetchAllProducts();
  // products.forEach(product => {
  //   urls.push({
  //     loc: `/product/${product.slug}`,
  //     lastmod: product.updated_at,
  //     changefreq: 'weekly',
  //     priority: 0.8,
  //   });
  // });

  // Add blog posts
  // const posts = await fetchAllBlogPosts();
  // posts.forEach(post => {
  //   urls.push({
  //     loc: `/blog/${post.slug}`,
  //     lastmod: post.updated_at,
  //     changefreq: 'monthly',
  //     priority: 0.7,
  //   });
  // });

  return generateSitemap(urls);
};