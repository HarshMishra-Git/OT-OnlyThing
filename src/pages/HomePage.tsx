import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import { 
  ShoppingBag, 
  ArrowRight,
  Star,
  Package,
  Check
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

export default function HomePage() {
  useEffect(() => {
    const tags = generateSEOTags({
      title: `${import.meta.env.VITE_APP_NAME || 'OnlyThing'} | Intelligent Skincare & Wellness`,
      description: 'Science-backed skincare and wellness. Discover featured products and shop by category.',
      keywords: 'skincare, wellness, science-backed, featured products, categories',
      image: `${window.location.origin}/L.jpg`,
      url: window.location.href,
      type: 'website',
    });
    updateMetaTags(tags);
  }, []);
  const { data: products, isLoading: productsLoading } = useFeaturedProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero Section */}
      <HeroSection />

      

      {/* Featured Products Section (dark for contrast with Hero) */}
      <section className="ink-section bg-black text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Featured Products
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Discover our handpicked selection of science-backed skincare solutions
            </p>
            <Link to="/shop" className="hidden md:inline-flex mt-6">
              <Button variant="outline" className="group border-white text-white hover:bg-white hover:text-black">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <Card key={product.id} className="group overflow-hidden border-2 border-black rounded-none bg-white text-black">
                  <Link to={`/product/${product.slug}`}>
                    <div className="relative aspect-square bg-white overflow-hidden border-b-2 border-black">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0].image_url}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-paper">
                          <Package className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                      {product.compare_price && product.compare_price > product.price && (
                        <Badge className="absolute top-4 right-4 bg-black text-white border-2 border-black">
                          {Math.round(
                            ((product.compare_price - product.price) /
                              product.compare_price) *
                              100
                          )}
                          % OFF
                        </Badge>
                      )}
                    </div>
                  </Link>

                  <div className="p-6 border-t-2 border-black bg-paper">
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:opacity-70 transition-opacity">
                        {product.name}
                      </h3>
                    </Link>

                    {product.short_description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(product.average_rating || 0)
                                ? 'fill-black text-black'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.review_count || 0})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black">
                        {formatCurrency(product.price)}
                      </span>
                      {product.compare_price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.compare_price)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => addToCart(product, 1)}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleWishlist(product)}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isInWishlist(product.id)
                              ? 'fill-black text-black'
                              : ''
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-black bg-paper">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-6">No featured products available</p>
              <Link to="/shop">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          )}

          {/* View All Button - Mobile */}
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop">
              <Button variant="outline" className="group border-white text-white hover:bg-white hover:text-black">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with decorative imagery */}
      <section className="ink-section bg-paper">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Why Choose Us
              </h2>
              <p className="text-lg text-gray-600">
                Science-backed solutions for your skin
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Clinically Proven',
                  description: 'All products backed by scientific research and clinical trials',
                },
                {
                  title: 'Personalized Care',
                  description: 'Customized solutions based on your unique skin profile',
                },
                {
                  title: 'Premium Quality',
                  description: 'Only the highest quality ingredients and formulations',
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4 text-xl font-black">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative image strip using unused hero images */}
          <div className="mt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['/pic5.png','/pic6.png','/pic7.png','/pic8.png'].map((src) => (
                <div key={src} className="aspect-square border-2 border-black overflow-hidden bg-white">
                  <img src={src} alt="Decorative" loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar moved below Why Choose Us */}
      <TrustBar variant="dark" />

      {/* CTA Section */}
      <section className="ink-section bg-paper text-black">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Take our science-backed skin assessment and get personalized product recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quiz">
              <Button size="lg" variant="secondary" className="min-w-[200px] group">
                Take Assessment
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="min-w-[200px] border-black text-black hover:bg-black hover:text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}