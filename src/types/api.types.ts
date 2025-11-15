// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter types
export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface QueryFilters {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// DTO types
export interface CreateProductDTO {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  sku?: string;
  stock_quantity: number;
  category_id?: string;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}

export interface CreateOrderDTO {
  items: {
    product_id: string;
    variant_id?: string;
    quantity: number;
    price: number;
  }[];
  shipping_address_id: string;
  customer_notes?: string;
  payment_method: string;
}

// Address input used when creating/updating addresses
export interface AddressInput {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: 'home' | 'work' | 'other';
  is_default?: boolean;
}

export interface CreateReviewDTO {
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface CreateQueryDTO {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface CreateBlogPostDTO {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  status?: 'draft' | 'published';
  is_featured?: boolean;
  category_ids?: string[];
}

export interface UpdateBlogPostDTO extends Partial<CreateBlogPostDTO> {
  id: string;
}

// Razorpay types
export interface RazorpayOrderData {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentData) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}