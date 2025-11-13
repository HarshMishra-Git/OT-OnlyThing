/**
 * Database Type Definitions for OT-OnlyThing
 * Generated types matching the complete database schema
 */

// =====================================================
// ENUMS
// =====================================================

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum QueryStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum QueryPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum WeightUnit {
  GRAM = 'g',
  KILOGRAM = 'kg',
  POUND = 'lb',
  OUNCE = 'oz',
}

// =====================================================
// DATABASE TABLES
// =====================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  address_type: AddressType;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
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
  compare_at_price: number | null;
  cost_per_item: number | null;
  category_id: string | null;
  image_url: string | null;
  sku: string | null;
  barcode: string | null;
  stock_quantity: number;
  weight: number | null;
  weight_unit: WeightUnit;
  ingredients: string | null;
  benefits: string | null;
  usage_instructions: string | null;
  is_active: boolean;
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
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
  variant_value: string;
  price_adjustment: number;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
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

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress | null;
  shipping_method: string | null;
  tracking_number: string | null;
  payment_method: string | null;
  payment_status: PaymentStatus;
  payment_gateway: string | null;
  payment_transaction_id: string | null;
  customer_notes: string | null;
  admin_notes: string | null;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

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
  admin_response: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: string | null;
  author_name: string | null;
  featured_image: string | null;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCategory {
  id: string;
  post_id: string;
  category_id: string;
  created_at: string;
}

// =====================================================
// DTOs (Data Transfer Objects)
// =====================================================

// Product DTOs
export interface CreateProductDTO {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  category_id?: string;
  image_url?: string;
  sku?: string;
  barcode?: string;
  stock_quantity?: number;
  weight?: number;
  weight_unit?: WeightUnit;
  ingredients?: string;
  benefits?: string;
  usage_instructions?: string;
  is_active?: boolean;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}

// Order DTOs
export interface CreateOrderDTO {
  user_id: string;
  items: Array<{
    product_id: string;
    variant_id?: string;
    quantity: number;
    unit_price: number;
  }>;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  shipping_method?: string;
  payment_method?: string;
  customer_notes?: string;
  subtotal: number;
  tax_amount?: number;
  shipping_amount?: number;
  discount_amount?: number;
  total_amount: number;
}

// Review DTOs
export interface CreateReviewDTO {
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewDTO extends Partial<CreateReviewDTO> {
  id: string;
}

// Cart DTOs
export interface AddToCartDTO {
  user_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
}

export interface UpdateCartItemDTO {
  id: string;
  quantity: number;
}

// Customer Query DTOs
export interface CreateCustomerQueryDTO {
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Blog Post DTOs
export interface CreateBlogPostDTO {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id?: string;
  author_name?: string;
  featured_image?: string;
  is_published?: boolean;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  category_ids?: string[];
}

export interface UpdateBlogPostDTO extends Partial<CreateBlogPostDTO> {
  id: string;
}

// =====================================================
// JOIN TYPES (with related data)
// =====================================================

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface ProductWithDetails extends Product {
  category?: Category;
  images: ProductImage[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  reviews?: Review[];
  avg_rating?: number;
  review_count?: number;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
  variant?: ProductVariant;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface ReviewWithUser extends Review {
  user: Pick<Profile, 'id' | 'full_name'>;
}

export interface BlogPostWithCategories extends BlogPost {
  categories: BlogCategory[];
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ProductFilters {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'created_desc';
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
}
