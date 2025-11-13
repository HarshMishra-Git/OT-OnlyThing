/**
 * Application-wide constants
 */

// Order Statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type OrderStatusType = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

// Payment Statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  AUTHORIZED: 'authorized',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

export type PaymentStatusType = typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES];

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const;

export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];

// Address Types
export const ADDRESS_TYPES = {
  SHIPPING: 'shipping',
  BILLING: 'billing',
} as const;

export type AddressTypeType = typeof ADDRESS_TYPES[keyof typeof ADDRESS_TYPES];

// Customer Query Statuses
export const QUERY_STATUSES = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export type QueryStatusType = typeof QUERY_STATUSES[keyof typeof QUERY_STATUSES];

// Customer Query Priorities
export const QUERY_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type QueryPriorityType = typeof QUERY_PRIORITIES[keyof typeof QUERY_PRIORITIES];

// Weight Units
export const WEIGHT_UNITS = {
  GRAM: 'g',
  KILOGRAM: 'kg',
  POUND: 'lb',
  OUNCE: 'oz',
} as const;

export type WeightUnitType = typeof WEIGHT_UNITS[keyof typeof WEIGHT_UNITS];

// Product Sort Options
export const PRODUCT_SORT_OPTIONS = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  CREATED_DESC: 'created_desc',
} as const;

export type ProductSortOptionType = typeof PRODUCT_SORT_OPTIONS[keyof typeof PRODUCT_SORT_OPTIONS];

// App Configuration
export const APP_CONFIG = {
  NAME: 'OT-OnlyThing',
  DESCRIPTION: 'Premium Health & Wellness E-commerce Platform',
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_CURRENCY_SYMBOL: '₹',
  DEFAULT_LOCALE: 'en-IN',
  ITEMS_PER_PAGE: 12,
  MAX_CART_QUANTITY: 99,
  MIN_ORDER_AMOUNT: 0,
  FREE_SHIPPING_THRESHOLD: 999,
  TAX_RATE: 0.18, // 18% GST
} as const;

// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  CURRENCY: 'INR',
  THEME_COLOR: '#3b82f6',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  CART: 'cart',
  WISHLIST: 'wishlist',
  RECENT_SEARCHES: 'recent_searches',
} as const;

// API Endpoints (if using custom backend)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
  },
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },
  REVIEWS: {
    LIST: (productId: string) => `/products/${productId}/reviews`,
    CREATE: '/reviews',
  },
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  POSTAL_CODE: /^[1-9][0-9]{5}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  REVIEW_MIN_LENGTH: 10,
  REVIEW_MAX_LENGTH: 1000,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number',
  INVALID_POSTAL_CODE: 'Please enter a valid 6-digit postal code',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  GENERIC_ERROR: 'Something went wrong. Please try again',
  UNAUTHORIZED: 'You must be logged in to perform this action',
  INSUFFICIENT_STOCK: 'Insufficient stock for this product',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED_TO_CART: 'Product added to cart',
  PRODUCT_ADDED_TO_WISHLIST: 'Product added to wishlist',
  ORDER_PLACED: 'Order placed successfully',
  REVIEW_SUBMITTED: 'Review submitted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  API: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// Image Placeholders
export const PLACEHOLDERS = {
  PRODUCT_IMAGE: 'https://via.placeholder.com/400x400?text=Product',
  USER_AVATAR: 'https://via.placeholder.com/150x150?text=User',
  CATEGORY_IMAGE: 'https://via.placeholder.com/300x300?text=Category',
  BLOG_IMAGE: 'https://via.placeholder.com/800x400?text=Blog',
} as const;

// SEO Defaults
export const SEO_DEFAULTS = {
  TITLE_SUFFIX: ' | OT-OnlyThing',
  DEFAULT_DESCRIPTION: 'Premium health and wellness products for your lifestyle',
  DEFAULT_KEYWORDS: ['health', 'wellness', 'skincare', 'supplements', 'organic'],
} as const;
