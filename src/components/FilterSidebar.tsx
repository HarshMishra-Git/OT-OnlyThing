import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'wellness', label: 'Wellness' },
];

const sortOptions = [
  { id: 'newest', label: 'Newest First' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

export function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
  onClearFilters,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...localPriceRange] as [number, number];
    newRange[index] = value;
    setLocalPriceRange(newRange);
    onPriceChange(newRange);
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-transform duration-300"
      >
        <SlidersHorizontal size={20} />
        Filters
        {activeFiltersCount > 0 && (
          <span className="w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-20 lg:top-28 left-0 h-[calc(100vh-5rem)] lg:h-auto 
          w-80 lg:w-full bg-white border-2 border-gray-200 rounded-none lg:rounded-2xl 
          overflow-y-auto z-40 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={20} />
              <h3 className="text-xl font-black">FILTERS</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="w-full mb-6 px-4 py-2 text-sm font-bold text-gray-600 hover:text-black border-2 border-gray-200 hover:border-black rounded-lg transition-all duration-300"
            >
              Clear All Filters
            </button>
          )}

          {/* Sort By */}
          <div className="mb-8">
            <h4 className="text-sm font-black mb-3 tracking-wider">SORT BY</h4>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onSortChange(option.id)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                    sortBy === option.id
                      ? 'bg-black text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h4 className="text-sm font-black mb-3 tracking-wider">CATEGORY</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-black text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h4 className="text-sm font-black mb-4 tracking-wider">PRICE RANGE</h4>
            <div className="space-y-4">
              {/* Min Price Slider */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-2 block">
                  Min: ₹{localPriceRange[0]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={localPriceRange[0]}
                  onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-gray-200 to-black rounded-full appearance-none cursor-pointer slider-thumb"
                />
              </div>

              {/* Max Price Slider */}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-2 block">
                  Max: ₹{localPriceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={localPriceRange[1]}
                  onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-black to-gray-200 rounded-full appearance-none cursor-pointer slider-thumb"
                />
              </div>

              {/* Price Display */}
              <div className="flex items-center justify-between pt-2">
                <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-black">
                  ₹{localPriceRange[0]}
                </span>
                <span className="text-gray-400">—</span>
                <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-black">
                  ₹{localPriceRange[1]}
                </span>
              </div>
            </div>
          </div>

          {/* Popular Filters */}
          <div className="mb-8">
            <h4 className="text-sm font-black mb-3 tracking-wider">POPULAR TAGS</h4>
            <div className="flex flex-wrap gap-2">
              {['Anti-Aging', 'Hydrating', 'Natural', 'Vegan', 'Cruelty-Free'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1.5 text-xs font-bold border-2 border-gray-200 hover:border-black rounded-full transition-all duration-300 hover:scale-105"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: black;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: black;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
}
