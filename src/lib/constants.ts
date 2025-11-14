// ============================================================
// ONLY THING HEALTH & WELLNESS - CONSTANTS
// ============================================================

export const COMPANY_INFO = {
  name: 'Only Thing Health & Wellness',
  tagline: "India's 1st Science-Backed, Data-Driven Intelligent Health & Wellness Company",
  description: 'Intelligent Skincare & Smart Nutrition powered by science',
  email: 'hello@onlything.in',
  phone: '+91 9876543210',
  address: 'Mumbai, Maharashtra, India',
};

export const CURRENCY_SYMBOL = '₹';

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const STORAGE_BUCKETS = {
  products: 'products',
  categories: 'categories',
  blog: 'blog',
  users: 'users',
};

export const SKIN_TYPES = [
  { value: 'dry', label: 'Dry', description: 'Tight, flaky, lacks moisture' },
  { value: 'oily', label: 'Oily', description: 'Shiny, enlarged pores, prone to acne' },
  { value: 'combination', label: 'Combination', description: 'Oily T-zone, dry cheeks' },
  { value: 'sensitive', label: 'Sensitive', description: 'Easily irritated, redness-prone' },
  { value: 'normal', label: 'Normal', description: 'Balanced, minimal concerns' },
];

export const SKIN_CONCERNS = [
  { value: 'acne', label: 'Acne & Breakouts', icon: '🔴' },
  { value: 'aging', label: 'Anti-Aging', icon: '⏳' },
  { value: 'pigmentation', label: 'Hyperpigmentation', icon: '🟤' },
  { value: 'dryness', label: 'Dryness & Dehydration', icon: '💧' },
  { value: 'dullness', label: 'Dull Skin', icon: '☁️' },
  { value: 'sensitivity', label: 'Sensitivity & Redness', icon: '🔥' },
  { value: 'dark-spots', label: 'Dark Spots', icon: '⚫' },
  { value: 'fine-lines', label: 'Fine Lines & Wrinkles', icon: '〰️' },
  { value: 'large-pores', label: 'Large Pores', icon: '🔍' },
  { value: 'dark-circles', label: 'Dark Circles', icon: '👁️' },
];

export const PRODUCT_CATEGORIES = [
  { name: 'Intelligent Skincare', slug: 'intelligent-skincare', icon: '✨' },
  { name: 'Smart Serums', slug: 'smart-serums', icon: '💧' },
  { name: 'Cleansers & Toners', slug: 'cleansers-toners', icon: '🧼' },
  { name: 'Moisturizers & Creams', slug: 'moisturizers-creams', icon: '🧴' },
  { name: 'Face Masks & Treatments', slug: 'face-masks-treatments', icon: '🎭' },
  { name: 'Eye Care', slug: 'eye-care', icon: '👁️' },
  { name: 'Sun Protection', slug: 'sun-protection', icon: '☀️' },
  { name: 'Smart Nutrition', slug: 'smart-nutrition', icon: '💊' },
  { name: 'Wellness Supplements', slug: 'wellness-supplements', icon: '🌿' },
  { name: 'Gift Sets', slug: 'gift-sets', icon: '🎁' },
];

export const CORE_BELIEFS = [
  {
    title: 'Intelligent Skincare',
    description: 'Guided by cellular science and adaptive bioactive',
    icon: '🧬',
  },
  {
    title: 'Powered By Science',
    description: 'Based on clinical evidence and next-gen biotechnology',
    icon: '🔬',
  },
  {
    title: 'Nature Meets AI',
    description: 'Blending nature, AI, and innovation for long-term well-being',
    icon: '🤖',
  },
  {
    title: 'Data-Driven',
    description: 'Measurable, scientific facts that back up every claim',
    icon: '📊',
  },
];