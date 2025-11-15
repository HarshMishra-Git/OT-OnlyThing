import { useMemo, lazy, Suspense } from 'react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { Button } from './Button';

const Product3D = lazy(() => import('./Product3D'));

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category?: string;
}

export function FeaturedProducts() {
  const { data, isLoading } = useFeaturedProducts(4);
  const products = useMemo(
    () =>
      (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image_url: p.images?.[0]?.image_url ?? '',
        category: p.category?.name,
      })),
    [data]
  );

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-products-section" className="py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter">
            FEATURED PRODUCTS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience our clinically-tested formulations in stunning 3D
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  id={index === 0 ? 'featured-product-first' : index === products.length - 1 ? 'featured-product-last' : undefined}
                  className="relative"
                >
                  <Suspense fallback={<div className="w-full h-[300px] bg-gray-100 animate-pulse rounded" />}>
                    <Product3D product={product} />
                  </Suspense>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button
                variant="primary"
                onClick={() => window.location.href = '/shop'}
              >
                View All Products
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">No products available yet</p>
            <p className="text-sm text-gray-400">Check back soon for our curated collection</p>
          </div>
        )}
      </div>
    </section>
  );
}
