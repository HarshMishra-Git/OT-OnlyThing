import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Query keys factory
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.products.details(), slug] as const,
    featured: ['products', 'featured'] as const,
  },
  
  // Categories
  categories: {
    all: ['categories'] as const,
    active: ['categories', 'active'] as const,
  },
  
  // Cart
  cart: {
    all: ['cart'] as const,
    items: ['cart', 'items'] as const,
  },
  
  // Wishlist
  wishlist: {
    all: ['wishlist'] as const,
    items: ['wishlist', 'items'] as const,
  },
  
  // Orders
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },
  
  // Reviews
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: string) => [...queryKeys.reviews.all, 'product', productId] as const,
  },
  
  // Queries
  queries: {
    all: ['queries'] as const,
    lists: () => [...queryKeys.queries.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.queries.lists(), filters] as const,
  },
  
  // Blog
  blog: {
    all: ['blog'] as const,
    lists: () => [...queryKeys.blog.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.blog.lists(), filters] as const,
    details: () => [...queryKeys.blog.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.blog.details(), slug] as const,
    featured: ['blog', 'featured'] as const,
  },
  
  // User
  user: {
    profile: ['user', 'profile'] as const,
    addresses: ['user', 'addresses'] as const,
  },
};