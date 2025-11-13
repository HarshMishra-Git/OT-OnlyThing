import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { EnhancedProductCard } from '../components/EnhancedProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Grid, List } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category?: string;
}

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  useScrollAnimation();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let query = supabase
          .from('products')
          .select('id, name, slug, price, image_url, category, stock_quantity')
          .eq('is_active', true);

        // Filter by category
        if (selectedCategory !== 'all') {
          query = query.eq('category', selectedCategory);
        }

        // Filter by price range
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);

        // Sort
        if (sortBy === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price-high') {
          query = query.order('price', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }
        
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, priceRange, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setSortBy('newest');
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 fade-in-observer">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tighter">
            SHOP ALL PRODUCTS
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Active Filters Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm font-bold text-gray-600">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-black text-white text-sm font-bold rounded-full flex items-center gap-2">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="hover:scale-110 transition-transform">
                  ×
                </button>
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 10000) && (
              <span className="px-3 py-1 bg-black text-white text-sm font-bold rounded-full flex items-center gap-2">
                ₹{priceRange[0]} - ₹{priceRange[1]}
                <button onClick={() => setPriceRange([0, 10000])} className="hover:scale-110 transition-transform">
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6">
          <div className="flex gap-2 border-2 border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors duration-200 ${
                viewMode === 'grid' ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors duration-200 ${
                viewMode === 'list' ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Main Content: Sidebar + Products */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filter Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Products Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-2xl mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <EnhancedProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 fade-in-observer">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-gray-700 mb-3">No products found</p>
                  <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
