import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useProductSearch } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category: string;
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);
  const [results, setResults] = useState<Product[]>([]);
  const { data, isFetching } = useProductSearch(debouncedQuery);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mapped = useMemo(
    () =>
      (data || []).slice(0, 5).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image_url: p.images?.[0]?.image_url ?? '',
        category: p.category?.name ?? '',
      })),
    [data]
  );

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    setResults(mapped);
  }, [mapped, debouncedQuery]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl mx-4">
      {/* Search Input */}
      <div
        className={`relative transition-all duration-500 ${
          isOpen ? 'scale-105' : 'scale-100'
        }`}
      >
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300"
            size={20}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products, ingredients, concerns..."
            className="w-full pl-12 pr-12 py-3 rounded-full border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm placeholder:text-gray-400"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors duration-300"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Animated Progress Bar */}
        {isFetching && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 overflow-hidden rounded-full">
            <div className="h-full bg-black animate-progress-bar" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down z-50 max-h-96 overflow-y-auto">
          {isFetching ? (
            <div className="p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 mt-3">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <a
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-100 group-hover:border-black transition-colors duration-300">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate group-hover:text-black transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {product.category}
                    </p>
                  </div>
                  <p className="font-black text-lg">₹{product.price.toFixed(0)}</p>
                </a>
              ))}
              <div className="border-t-2 border-gray-100 mt-2 pt-2 px-4 pb-2">
                <a
                  href={`/shop?q=${query}`}
                  className="block text-center text-sm font-bold text-black hover:underline"
                >
                  View all results for "{query}"
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="text-gray-400" size={24} />
              </div>
              <p className="text-sm font-bold text-gray-700 mb-2">No products found</p>
              <p className="text-xs text-gray-500">Try different keywords</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes progress-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-bar {
          animation: progress-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
