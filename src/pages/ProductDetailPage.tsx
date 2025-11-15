import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useRelatedProducts } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import { Rating } from '@/components/common/Rating';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Tabs } from '@/components/common/Tabs';
import { ShareButtons } from '@/components/common/ShareButtons';
import { formatCurrency, calculateDiscount, isInStock, isLowStock } from '@/lib/utils';
import { 
  Heart, 
  ShoppingCart, 
  Truck, 
  Shield, 
  ArrowLeft,
  Check,
  AlertCircle,
  Star,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const { data: reviews } = useReviews(product?.id || '');
  const [reviewsSort, setReviewsSort] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const { data: related } = useRelatedProducts(
    product?.category?.id || '',
    product?.id || '',
    8
  );

  const selectedVariant = useMemo(() => {
    const variants = (product as any)?.variants as Array<any> | undefined;
    if (!variants || variants.length === 0) return undefined;
    return variants.find((v) => v.id === selectedVariantId);
  }, [product, selectedVariantId]);

  const effectivePrice = useMemo(() => {
    if (selectedVariant && typeof selectedVariant.price === 'number' && selectedVariant.price > 0) {
      return selectedVariant.price as number;
    }
    return product?.price || 0;
  }, [selectedVariant, product]);

  const availableStock = useMemo(() => {
    if (selectedVariant && typeof selectedVariant.stock_quantity === 'number') {
      return selectedVariant.stock_quantity as number;
    }
    return product?.stock_quantity || 0;
  }, [selectedVariant, product]);

  useEffect(() => {
    if (!product) return;
    const image = product.images?.[0]?.image_url;
    const tags = generateSEOTags({
      title: `${product.name} | ${import.meta.env.VITE_APP_NAME || 'OnlyThing'}`,
      description: product.meta_description || product.short_description || product.description?.slice(0, 160) || 'Explore product details, reviews, and related items.',
      keywords: `${product.name}, skincare, wellness, product` ,
      image: image || `${window.location.origin}/L.jpg`,
      url: window.location.href,
      type: 'product',
    });
    updateMetaTags(tags);
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist</p>
        <Link to="/shop">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const specifications = product.specifications || [];
  const inWishlist = isInWishlist(product.id);
  const discount = product.compare_price 
    ? calculateDiscount(product.compare_price, product.price)
    : 0;

  const handleAddToCart = () => {
    if (!isInStock(availableStock)) {
      toast.error('Product is out of stock');
      return;
    }
    const productWithImages = {
      ...product,
      images: product.images || [],
    };
    addToCart(productWithImages, quantity, selectedVariantId);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      window.location.href = '/login';
      return;
    }
    if (!isInStock(availableStock)) {
      toast.error('Product is out of stock');
      return;
    }
    const productWithImages = {
      ...product,
      images: product.images || [],
    };
    addToCart(productWithImages, quantity, selectedVariantId);
    window.location.href = '/checkout';
  };

  const handleToggleWishlist = () => {
    const productWithImages = {
      ...product,
      images: product.images || [],
    };
    toggleWishlist(productWithImages);
  };

  const incrementQuantity = () => {
    if (quantity < availableStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const productTabs = [
    {
      id: 'description',
      label: 'Description',
      content: (
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">
            {product.description || 'No description available'}
          </p>
        </div>
      ),
    },
    {
      id: 'specifications',
      label: 'Specifications',
      content: (
        <div>
          {specifications.length > 0 ? (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specifications.map((spec) => (
                <div key={spec.id} className="border-b pb-3">
                  <dt className="text-sm font-medium text-gray-500 mb-1">
                    {spec.spec_key}
                  </dt>
                  <dd className="text-base text-gray-900">{spec.spec_value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-gray-500">No specifications available</p>
          )}
        </div>
      ),
    },
    {
      id: 'reviews',
      label: `Reviews (${reviews?.length || 0})`,
      content: (
        <div>
          {/* Sorting Controls */}
          {reviews && reviews.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Sort reviews
              </div>
              <select
                value={reviewsSort}
                onChange={(e) => setReviewsSort(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
              </select>
            </div>
          )}

          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {([...reviews]
                .sort((a, b) => {
                  if (reviewsSort === 'newest') {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                  }
                  if (reviewsSort === 'highest') {
                    return (b.rating || 0) - (a.rating || 0);
                  }
                  return (a.rating || 0) - (b.rating || 0);
                }))
                .map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {review.user?.full_name || 'Anonymous'}
                          </span>
                          {review.is_verified_purchase && (
                            <Badge variant="success" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <Rating value={review.rating} readonly size="sm" />
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && (
                      <h4 className="font-medium text-gray-900 mb-2">
                        {review.title}
                      </h4>
                    )}
                    <p className="text-gray-700">{review.comment}</p>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No reviews yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Be the first to review this product
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary-600">Shop</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <Card className="overflow-hidden mb-4">
              <div className="relative aspect-square bg-gray-100">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]?.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-300" />
                  </div>
                )}
                {discount > 0 && (
                  <Badge variant="error" className="absolute top-4 right-4 text-base px-3 py-1">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
            </Card>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              {product.category && (
                <Link
                  to={`/shop?category=${product.category.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {product.category.name}
                </Link>
              )}
            </div>

            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <ShareButtons url={`${window.location.origin}/product/${product.slug || product.id}`} title={product.name} compact />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <Rating value={product.average_rating || 0} readonly showValue />
              <span className="text-sm text-gray-600">
                ({product.review_count || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatCurrency(effectivePrice)}
                </span>
                {product.compare_price && (
                  <span className="text-2xl text-gray-500 line-through">
                    {formatCurrency(product.compare_price)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-green-600 font-medium mt-2">
                  You save {formatCurrency(product.compare_price! - effectivePrice)} ({discount}%)
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {isInStock(availableStock) ? (
                <>
                  {isLowStock(availableStock) ? (
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">
                        Only {availableStock} left in stock!
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">In Stock</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-700 mb-6">{product.short_description}</p>
            )}

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Variant
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants
                    .filter((v) => v.is_active)
                    .map((variant) => {
                      const isSelected = selectedVariantId === variant.id;
                      const vPrice = typeof variant.price === 'number' && variant.price > 0 ? variant.price : product.price;
                      const vStock = variant.stock_quantity;
                      const disabled = vStock < 1;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => !disabled && setSelectedVariantId(variant.id)}
                          className={`flex items-center justify-between px-3 py-2 border rounded-lg text-left transition-colors ${
                            disabled
                              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                              : isSelected
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <span className="font-medium truncate">{variant.variant_name}</span>
                          <span className="text-sm">
                            {formatCurrency(vPrice)}
                          </span>
                        </button>
                      );
                    })}
                </div>
                {selectedVariant && selectedVariant.stock_quantity < 5 && selectedVariant.stock_quantity > 0 && (
                  <p className="text-xs text-orange-600 mt-2">Only {selectedVariant.stock_quantity} left for selected variant</p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity >= availableStock}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {availableStock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={!isInStock(availableStock)}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleToggleWishlist}
                variant="outline"
                size="lg"
              >
                <Heart
                  className={`w-5 h-5 ${
                    inWishlist ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
              </Button>
            </div>

            <Button
              onClick={handleBuyNow}
              disabled={!isInStock(availableStock)}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              Buy Now
            </Button>

            {/* Features */}
            <Card className="mt-6 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Free shipping on orders over ₹500
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    100% secure payment
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Quality guaranteed
                  </span>
                </div>
              </div>
            </Card>

            {/* SKU */}
            {product.sku && (
              <p className="text-sm text-gray-500 mt-4">
                SKU: <span className="font-medium">{product.sku}</span>
              </p>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="p-6">
          <Tabs tabs={productTabs} />
        </Card>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p: any) => (
                <Card key={p.id} className="group overflow-hidden">
                  <Link to={`/product/${p.slug}`}>
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {p.images && p.images[0] ? (
                        <img
                          src={p.images[0].image_url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                      {p.compare_price && p.compare_price > p.price && (
                        <Badge className="absolute top-4 right-4 bg-black text-white border-2 border-black">
                          {Math.round(
                            ((p.compare_price - p.price) / p.compare_price) * 100
                          )}
                          % OFF
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <div className="p-6 border-t-2 border-black">
                    <Link to={`/product/${p.slug}`}>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:opacity-70 transition-opacity">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">
                        {formatCurrency(p.price)}
                      </span>
                      {p.compare_price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(p.compare_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}