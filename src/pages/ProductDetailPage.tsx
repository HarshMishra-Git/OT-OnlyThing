import { useEffect, useState } from 'react';
import { useParams } from './useParams';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { ReviewForm } from '../components/ReviewForm';
import { ProductGallery } from '../components/ProductGallery';
import { EnhancedReviews } from '../components/EnhancedReviews';
import { StickyAddToCart } from '../components/StickyAddToCart';
import { Star, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  images: string[];
  category: string;
  ingredients: string;
  benefits: string;
  usage_instructions: string;
  stock_quantity: number;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Define fetchProductAndReviews outside of useEffect so it can be reused
  const fetchProductAndReviews = async () => {
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (productError) {
        console.error('Error fetching product:', productError);
        throw productError;
      }
      
      setProduct(productData);

      if (productData) {
        // Try to fetch reviews, but don't fail if reviews table doesn't exist
        try {
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('reviews')
            .select('id, rating, title, comment, created_at, profiles(full_name)')
            .eq('product_id', productData.id)
            .order('created_at', { ascending: false });

          if (reviewsError) {
            console.warn('Reviews table not available or error fetching:', reviewsError);
            setReviews([]);
          } else {
            setReviews(reviewsData || []);
          }
        } catch (reviewError) {
          console.warn('Reviews feature not available:', reviewError);
          setReviews([]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
  }, [slug]);

  const handleAddToCart = async (qty: number = quantity) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setAddingToCart(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: product!.id,
          quantity: qty,
        }, { onConflict: 'user_id,product_id' });

      if (error) throw error;
      window.location.href = '/cart';
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => window.location.href = '/shop'}>
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // Prepare images array for gallery
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={productImages} productName={product.name} />
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-black mb-6">₹{product.price.toFixed(2)}</p>

              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        fill={star <= averageRating ? 'black' : 'none'}
                        stroke="black"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 mb-6 border-y-2 border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <p className="text-xs font-bold">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <p className="text-xs font-bold">Secure Payment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <RotateCcw size={24} />
                </div>
                <p className="text-xs font-bold">Easy Returns</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-black rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 font-bold hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-3 font-bold border-x-2 border-black">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="px-4 py-3 font-bold hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
              <Button
                onClick={() => handleAddToCart(quantity)}
                disabled={addingToCart || product.stock_quantity === 0}
                className="flex-1"
              >
                {addingToCart ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>

            {product.stock_quantity > 0 && product.stock_quantity < 10 && (
              <p className="text-sm text-red-600 font-bold mt-3">
                Only {product.stock_quantity} left in stock!
              </p>
            )}

            {product.benefits && (
              <div>
                <h3 className="text-lg font-bold mb-3">BENEFITS</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{product.benefits}</p>
              </div>
            )}

            {product.ingredients && (
              <div>
                <h3 className="text-lg font-bold mb-3">KEY INGREDIENTS</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            {product.usage_instructions && (
              <div>
                <h3 className="text-lg font-bold mb-3">HOW TO USE</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{product.usage_instructions}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t-2 border-gray-200 pt-12">
          <h2 className="text-4xl md:text-5xl font-black mb-8">CUSTOMER REVIEWS</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ReviewForm productId={product.id} onSuccess={fetchProductAndReviews} />
          </div>

          {reviews.length > 0 ? (
            <EnhancedReviews 
              reviews={reviews} 
              averageRating={averageRating} 
              productId={product.id}
            />
          ) : (
            <p className="text-center text-gray-500 py-12 text-lg">No reviews yet. Be the first to review!</p>
          )}
        </div>

        {/* Sticky Add to Cart */}
        <StickyAddToCart
          productName={product.name}
          productImage={product.image_url}
          price={product.price}
          stockQuantity={product.stock_quantity}
          onAddToCart={handleAddToCart}
          isAdding={addingToCart}
        />
      </div>
    </div>
  );
}
