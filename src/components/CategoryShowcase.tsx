import { useEffect, useState } from 'react';
import { PRODUCT_CATEGORIES, getProductsByCategory } from '../data/products';
import { supabase } from '../lib/supabase';

interface CategoryCount {
  category: string;
  count: number;
}

export function CategoryShowcase() {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    async function fetchCategoryCounts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category')
          .eq('is_active', true);
        
        if (error) throw error;
        
        // Count products per category
        const counts: Record<string, number> = {};
        data?.forEach((product) => {
          const cat = product.category?.toLowerCase() || 'other';
          counts[cat] = (counts[cat] || 0) + 1;
        });
        
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    }
    
    fetchCategoryCounts();
  }, []);
  
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-6 tracking-tight fade-in-observer">
          SHOP BY CATEGORY
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto fade-in-observer">
          Discover our science-backed products, each designed with precision for your specific needs
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-in-observer">
          {PRODUCT_CATEGORIES.filter(c => c.slug !== 'all').map((category) => {
            const products = getProductsByCategory(category.slug);
            const featuredProduct = products[0];
            const actualCount = categoryCounts[category.slug] || 0;
            
            return (
              <a
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group relative h-96 rounded-2xl overflow-hidden hover-lift shadow-3d hover:shadow-3d-lg"
                style={{
                  background: `linear-gradient(135deg, ${category.color}20, ${category.color}05)`
                }}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={featuredProduct?.images.lifestyle}
                    alt={category.name}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-600"
                  />
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className="text-6xl mb-4 animate-float">{category.icon}</span>
                  <h3 className="text-4xl font-black text-white mb-2 tracking-tight">
                    {category.name.toUpperCase()}
                  </h3>
                  <p className="text-white/80 text-lg mb-4">
                    {actualCount} Premium Product{actualCount !== 1 ? 's' : ''}
                  </p>
                  
                  {/* Color bar */}
                  <div 
                    className="w-20 h-1 mb-4 transition-all duration-400 group-hover:w-32"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  
                  {/* CTA */}
                  <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-4 group-hover:translate-y-0">
                    <span className="font-bold text-sm uppercase tracking-wider">Explore Collection</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Hover glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${category.color}40, transparent 70%)`
                  }}
                ></div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
