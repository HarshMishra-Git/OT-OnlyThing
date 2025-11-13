import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { Select } from '@/components/common/Select';
import { Input } from '@/components/common/Input';
import { Pagination } from '@/components/common/Pagination';
import { Rating } from '@/components/common/Rating';
import { 
  Package, 
  Search, 
  SlidersHorizontal,
  Grid3x3,
  LayoutList,
  ShoppingCart,
  Heart,
  Star
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  });

  const { data: products, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const totalPages = products ? Math.ceil(products.length / filters.limit) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
              <p className="text-gray-600 mt-1">
                {products?.length || 0} products found
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0">
              <Card className="p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select
                      options={[
                        { value: '', label: 'All Categories' },
                        ...(categories?.map((cat) => ({
                          value: cat.id,
                          label: cat.name,
                        })) || []),
                      ]}
                      value={filters.category}
                      onChange={(e) => updateFilters({ category: e.target.value })}
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={filters.minPrice || ''}
                        onChange={(e) =>
                          updateFilters({ minPrice: Number(e.target.value) || undefined })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={filters.maxPrice || ''}
                        onChange={(e) =>
                          updateFilters({ maxPrice: Number(e.target.value) || undefined })
                        }
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <Select
                      options={[
                        { value: 'newest', label: 'Newest First' },
                        { value: 'price_asc', label: 'Price: Low to High' },
                        { value: 'price_desc', label: 'Price: High to Low' },
                        { value: 'name', label: 'Name: A to Z' },
                        { value: 'popular', label: 'Most Popular' },
                      ]}
                      value={filters.sortBy}
                      onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
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
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      hover
                      className={viewMode === 'list' ? 'p-4' : ''}
                    >
                      {viewMode === 'grid' ? (
                        // Grid View
                        <div className="group">
                          <Link to={`/product/${product.slug}`}>
                            <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-t-lg">
                              {product.images && product.images[0] ? (
                                <img
                                  src={product.images[0].image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-16 h-16 text-gray-300" />
                                </div>
                              )}
                              {product.compare_price && (
                                <Badge
                                  variant="error"
                                  className="absolute top-3 right-3"
                                >
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

                          <div className="p-4">
                            <Link to={`/product/${product.slug}`}>
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                                {product.name}
                              </h3>
                            </Link>

                            <div className="flex items-center gap-2 mb-3">
                              <Rating value={product.average_rating || 0} readonly size="sm" />
                              <span className="text-sm text-gray-600">
                                ({product.review_count || 0})
                              </span>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-xl font-bold text-gray-900">
                                  {formatCurrency(product.price)}
                                </span>
                                {product.compare_price && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    {formatCurrency(product.compare_price)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1"
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
                                <Heart
                                  className={`w-4 h-4 ${
                                    isInWishlist(product.id)
                                      ? 'fill-red-500 text-red-500'
                                      : ''
                                  }`}
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // List View
                        <div className="flex gap-4">
                          <Link to={`/product/${product.slug}`}>
                            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                              <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                                {product.name}
                              </h3>
                            </Link>

                            <div className="flex items-center gap-2 mb-2">
                              <Rating value={product.average_rating || 0} readonly size="sm" />
                              <span className="text-sm text-gray-600">
                                ({product.review_count || 0})
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.short_description}
                            </p>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xl font-bold text-gray-900">
                                  {formatCurrency(product.price)}
                                </span>
                                {product.compare_price && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
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
                                  <Heart
                                    className={`w-4 h-4 ${
                                      isInWishlist(product.id)
                                        ? 'fill-red-500 text-red-500'
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={filters.page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}