export interface Database {
  public: {
    Tables: {
      profiles: Profile;
      addresses: Address;
      categories: Category;
      products: Product;
      product_images: ProductImage;
      product_specifications: ProductSpecification;
      product_variants: ProductVariant;
      reviews: Review;
      cart_items: CartItem;
      wishlist_items: WishlistItem;
      orders: Order;
      order_items: OrderItem;
      customer_queries: CustomerQuery;
      blog_posts: BlogPost;
      blog_categories: BlogCategory;
      blog_post_categories: BlogPostCategory;
    };
  };
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  address_type: 'home' | 'work' | 'other';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_price: number | null;
  cost_price: number | null;
  sku: string | null;
  barcode: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  is_featured: boolean;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductSpecification {
  id: string;
  product_id: string;
  spec_key: string;
  spec_value: string;
  display_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  sku: string | null;
  price: number | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  helpful_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  total: number;
  shipping_address_id: string | null;
  shipping_full_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  payment_status: PaymentStatus;
  payment_method: string | null;
  payment_id: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  customer_notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_sku: string | null;
  variant_name: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export type QueryStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type QueryPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CustomerQuery {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: QueryStatus;
  priority: QueryPriority;
  assigned_to: string | null;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: BlogPostStatus;
  is_featured: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPostCategory {
  blog_post_id: string;
  category_id: string;
}

// Extended types with relationships
export interface ProductWithDetails extends Product {
  images: ProductImage[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  category: Category | null;
  reviews: Review[];
  average_rating: number;
  review_count: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  user: Profile | null;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
  variant: ProductVariant | null;
}

export interface WishlistItemWithProduct extends WishlistItem {
  product: Product;
}

export interface ReviewWithUser extends Review {
  user: Profile;
}

export interface BlogPostWithAuthor extends BlogPost {
  author: Profile | null;
  categories: BlogCategory[];
}