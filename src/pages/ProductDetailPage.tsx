import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
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

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  const { data: reviews } = useReviews(product?.id || '');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

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
    if (!isInStock(product.stock_quantity)) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      window.location.href = '/login';
      return;
    }
    if (!isInStock(product.stock_quantity)) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product, quantity);
    window.location.href = '/checkout';
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
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
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
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
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-gray-900">Shop</Link>
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
                        ? 'border-gray-900'
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
                  className="text-sm text-gray-900 hover:text-gray-600 font-medium"
                >
                  {product.category.name}
                </Link>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

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
                  {formatCurrency(product.price)}
                </span>
                {product.compare_price && (
                  <span className="text-2xl text-gray-500 line-through">
                    {formatCurrency(product.compare_price)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-green-600 font-medium mt-2">
                  You save {formatCurrency(product.compare_price! - product.price)} ({discount}%)
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {isInStock(product.stock_quantity) ? (
                <>
                  {isLowStock(product.stock_quantity) ? (
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">
                        Only {product.stock_quantity} left in stock!
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
                    disabled={quantity >= product.stock_quantity}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock_quantity} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={!isInStock(product.stock_quantity)}
                variant="cta"
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
              disabled={!isInStock(product.stock_quantity)}
              variant="primary"
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
      </div>
    </div>
  );
}