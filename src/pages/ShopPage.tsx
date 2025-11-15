import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Select } from '@/components/common/Select';
import { Input } from '@/components/common/Input';
import { 
  Package, 
  Search, 
  SlidersHorizontal,
  Grid3x3,
  LayoutList,
  ShoppingCart,
  Star,
  X
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: Number(searchParams.get('minPrice')) || undefined,
    maxPrice: Number(searchParams.get('maxPrice')) || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'newest',
    page: 1,
    limit: 12,
  });

  const { data: products, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);

    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const reset = {
      category: '',
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'newest' as const,
      page: 1,
      limit: 12,
    };
    setFilters(reset);
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    const q = (filters.search || '').trim();
    const title = q
      ? `Search: ${q} | ${import.meta.env.VITE_APP_NAME || 'OnlyThing'}`
      : `Shop | ${import.meta.env.VITE_APP_NAME || 'OnlyThing'}`;
    const description = q
      ? `Browse products matching "${q}". Filter by category and price.`
      : 'Shop all science-backed skincare products. Filter by category and price.';
    const tags = generateSEOTags({
      title,
      description,
      keywords: 'shop, skincare, wellness, filters, search',
      image: `${window.location.origin}/1.jpg`,
      url: window.location.href,
      type: 'website',
    });
    updateMetaTags(tags);
  }, [filters.search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white">
        <div className="w-full max-w-none px-4 md:px-8 lg:px-16 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black mb-2 text-white">Shop All Products</h1>
              <p className="text-gray-300">
                {products?.length || 0} products found
              </p>
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                onClick={() => setViewMode('list')}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <Input
                type="search"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-12 bg-black/20 text-white placeholder-gray-300 border-white"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden border-white text-white hover:bg-white hover:text-black"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Light content section */}
      <div className="w-full max-w-none px-4 md:px-8 lg:px-16 py-8 bg-gray-50">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-72 flex-shrink-0">
              <Card className="bg-white border-2 border-black p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black uppercase tracking-wide">Filters</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearFilters}
                    className="border-black text-black hover:bg-black hover:text-white rounded-md whitespace-nowrap tracking-normal"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <Select
                      label="Category"
                      options={[
                        { value: '', label: 'All Categories' },
                        ...(categories?.map((cat) => ({
                          value: cat.id,
                          label: cat.name,
                        })) || []),
                      ]}
                      value={filters.category}
                      onChange={(e) => updateFilters({ category: e.target.value })}
                      className="bg-white"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={filters.minPrice || ''}
                        onChange={(e) =>
                          updateFilters({ minPrice: Number(e.target.value) || undefined })
                        }
                        className="bg-white"
                      />
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={filters.maxPrice || ''}
                        onChange={(e) =>
                          updateFilters({ maxPrice: Number(e.target.value) || undefined })
                        }
                        className="bg-white"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <Select
                      label="Sort By"
                      options={[
                        { value: 'newest', label: 'Newest First' },
                        { value: 'price_asc', label: 'Price: Low to High' },
                        { value: 'price_desc', label: 'Price: High to Low' },
                        { value: 'name', label: 'Name: A to Z' },
                        { value: 'popular', label: 'Most Popular' },
                      ]}
                      value={filters.sortBy}
                      onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                      className="bg-white"
                    />
                  </div>
                </div>
              </Card>
            </aside>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : !products || products.length === 0 ? (
              <Card className="p-12">
                <EmptyState
                  icon={<Package className="w-16 h-16 text-gray-400" />}
                  title="No products found"
                  description="Try adjusting your filters or search terms"
                  action={
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  }
                />
              </Card>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {products.map((product) => (
                  <Card key={product.id} className="group">
                    {viewMode === 'grid' ? (
                      // Grid View
                      <>
                        <Link to={`/product/${product.slug}`}>
                          <div className="relative aspect-square bg-gray-100 overflow-hidden">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0].image_url}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-300" />
                              </div>
                            )}
                            {product.compare_price && (
                              <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-xs font-bold">
                                {Math.round(
                                  ((product.compare_price - product.price) /
                                    product.compare_price) *
                                    100
                                )}
                                % OFF
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="p-6 border-t-2 border-black">
                          <Link to={`/product/${product.slug}`}>
                            <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:opacity-70 transition-opacity">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-2 mb-3">
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

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => addToCart(product, 1)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add
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
                      </>
                    ) : (
                      // List View
                      <div className="flex gap-4 p-6">
                        <Link to={`/product/${product.slug}`}>
                          <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0].image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="flex-1">
                          <Link to={`/product/${product.slug}`}>
                            <h3 className="font-bold text-lg mb-2 hover:opacity-70 transition-opacity">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-2 mb-2">
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

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.short_description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black">
                                {formatCurrency(product.price)}
                              </span>
                              {product.compare_price && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatCurrency(product.compare_price)}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => addToCart(product, 1)}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
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
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}