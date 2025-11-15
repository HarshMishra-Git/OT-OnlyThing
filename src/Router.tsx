import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Spinner } from '@/components/common/Spinner';

// Public Pages - lazy loaded
// Default exports
const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
// Named exports mapped to default for React.lazy
const CartPage = lazy(() => import('@/pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('@/pages/SignupPage').then(m => ({ default: m.SignupPage })));
const AuthCallback = lazy(() => import('@/pages/AuthCallback').then(m => ({ default: m.AuthCallback })));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BlogPage = lazy(() => import('@/pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailPage = lazy(() => import('@/pages/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const FAQPage = lazy(() => import('@/pages/FAQPage').then(m => ({ default: m.FAQPage })));
const SciencePage = lazy(() => import('@/pages/SciencePage').then(m => ({ default: m.SciencePage })));
const QuizPage = lazy(() => import('@/pages/QuizPage').then(m => ({ default: m.QuizPage })));

// User Pages
// Default export
const AccountPage = lazy(() => import('@/pages/AccountPage'));

// Admin Pages
// Named exports mapped
const AdminDashboard = lazy(() => import('@/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ProductList = lazy(() => import('@/admin/pages/Products/ProductList').then(m => ({ default: m.ProductList })));
const ProductForm = lazy(() => import('@/admin/pages/Products/ProductForm').then(m => ({ default: m.ProductForm })));
const QueryList = lazy(() => import('@/admin/pages/Queries/QueryList').then(m => ({ default: m.QueryList })));
// Default export
const QueryDetail = lazy(() => import('@/admin/pages/Queries/QueryDetail'));
// Named exports mapped
const BlogList = lazy(() => import('@/admin/pages/Blog/BlogList').then(m => ({ default: m.BlogList })));
const BlogEditor = lazy(() => import('@/admin/pages/Blog/BlogEditor').then(m => ({ default: m.BlogEditor })));
const OrderList = lazy(() => import('@/admin/pages/Orders/OrderList').then(m => ({ default: m.OrderList })));
const OrderDetail = lazy(() => import('@/admin/pages/Orders/OrderDetail').then(m => ({ default: m.OrderDetail })));

export default function Router() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Suspense fallback={<Spinner size="lg" />}><HomePage /></Suspense>} />
            <Route path="shop" element={<Suspense fallback={<Spinner size="lg" />}><ShopPage /></Suspense>} />
            <Route path="product/:slug" element={<Suspense fallback={<Spinner size="lg" />}><ProductDetailPage /></Suspense>} />
            <Route path="cart" element={<Suspense fallback={<Spinner size="lg" />}><CartPage /></Suspense>} />
            <Route path="about" element={<Suspense fallback={<Spinner size="lg" />}><AboutPage /></Suspense>} />
            <Route path="contact" element={<Suspense fallback={<Spinner size="lg" />}><ContactPage /></Suspense>} />
            <Route path="blog" element={<Suspense fallback={<Spinner size="lg" />}><BlogPage /></Suspense>} />
            <Route path="blog/:slug" element={<Suspense fallback={<Spinner size="lg" />}><BlogDetailPage /></Suspense>} />
            <Route path="faq" element={<Suspense fallback={<Spinner size="lg" />}><FAQPage /></Suspense>} />
            <Route path="science" element={<Suspense fallback={<Spinner size="lg" />}><SciencePage /></Suspense>} />
            <Route path="quiz" element={<Suspense fallback={<Spinner size="lg" />}><QuizPage /></Suspense>} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Suspense fallback={<Spinner size="lg" />}><LoginPage /></Suspense>} />
          <Route path="/signup" element={<Suspense fallback={<Spinner size="lg" />}><SignupPage /></Suspense>} />
          <Route path="/auth/callback" element={<Suspense fallback={<Spinner size="lg" />}><AuthCallback /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<Spinner size="lg" />}><ForgotPasswordPage /></Suspense>} />
          <Route path="/reset-password" element={<Suspense fallback={<Spinner size="lg" />}><ResetPasswordPage /></Suspense>} />

          {/* Protected User Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Suspense fallback={<Spinner size="lg" />}><CheckoutPage /></Suspense>} />
          </Route>

          <Route
            path="/order-confirmation/:orderId"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Suspense fallback={<Spinner size="lg" />}><OrderConfirmationPage /></Suspense>} />
          </Route>

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Suspense fallback={<Spinner size="lg" />}><AccountPage /></Suspense>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Suspense fallback={<Spinner size="lg" />}><AdminDashboard /></Suspense>} />
            
            {/* Products */}
            <Route path="products">
              <Route index element={<Suspense fallback={<Spinner size="lg" />}><ProductList /></Suspense>} />
              <Route path="new" element={<Suspense fallback={<Spinner size="lg" />}><ProductForm /></Suspense>} />
              <Route path=":id/edit" element={<Suspense fallback={<Spinner size="lg" />}><ProductForm /></Suspense>} />
            </Route>

            {/* Orders */}
            <Route path="orders">
              <Route index element={<Suspense fallback={<Spinner size="lg" />}><OrderList /></Suspense>} />
              <Route path=":id" element={<Suspense fallback={<Spinner size="lg" />}><OrderDetail /></Suspense>} />
            </Route>

            {/* Queries */}
            <Route path="queries">
              <Route index element={<Suspense fallback={<Spinner size="lg" />}><QueryList /></Suspense>} />
              <Route path=":id" element={<Suspense fallback={<Spinner size="lg" />}><QueryDetail /></Suspense>} />
            </Route>

            {/* Blog */}
            <Route path="blog">
              <Route index element={<Suspense fallback={<Spinner size="lg" />}><BlogList /></Suspense>} />
              <Route path="new" element={<Suspense fallback={<Spinner size="lg" />}><BlogEditor /></Suspense>} />
              <Route path=":id/edit" element={<Suspense fallback={<Spinner size="lg" />}><BlogEditor /></Suspense>} />
            </Route>

            {/* Analytics - Placeholder */}
            <Route path="analytics" element={<div className="p-6">Analytics Dashboard (Coming Soon)</div>} />
            
            {/* Settings - Placeholder */}
            <Route path="settings" element={<div className="p-6">Settings (Coming Soon)</div>} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

// 404 Page Component
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}