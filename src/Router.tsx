import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Public Pages - UPDATED IMPORTS
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { AuthCallback } from '@/pages/AuthCallback';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { BlogPage } from '@/pages/BlogPage';
import { FAQPage } from '@/pages/FAQPage';
import { SciencePage } from '@/pages/SciencePage';
import { QuizPage } from '@/pages/QuizPage';

// User Pages
import AccountPage from '@/pages/AccountPage';

// Admin Pages
import { AdminDashboard } from '@/admin/AdminDashboard';
import { ProductList } from '@/admin/pages/Products/ProductList';
import { ProductForm } from '@/admin/pages/Products/ProductForm';
import { QueryList } from '@/admin/pages/Queries/QueryList';
import QueryDetail from '@/admin/pages/Queries/QueryDetail';
import { BlogList } from '@/admin/pages/Blog/BlogList';
import { BlogEditor } from '@/admin/pages/Blog/BlogEditor';
import { OrderList } from '@/admin/pages/Orders/OrderList';
import { OrderDetail } from '@/admin/pages/Orders/OrderDetail';

export default function Router() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="science" element={<SciencePage />} />
            <Route path="quiz" element={<QuizPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected User Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CheckoutPage />} />
          </Route>

          <Route
            path="/order-confirmation/:orderId"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OrderConfirmationPage />} />
          </Route>

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AccountPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            
            {/* Products */}
            <Route path="products">
              <Route index element={<ProductList />} />
              <Route path="new" element={<ProductForm />} />
              <Route path=":id/edit" element={<ProductForm />} />
            </Route>

            {/* Orders */}
            <Route path="orders">
              <Route index element={<OrderList />} />
              <Route path=":id" element={<OrderDetail />} />
            </Route>

            {/* Queries */}
            <Route path="queries">
              <Route index element={<QueryList />} />
              <Route path=":id" element={<QueryDetail />} />
            </Route>

            {/* Blog */}
            <Route path="blog">
              <Route index element={<BlogList />} />
              <Route path="new" element={<BlogEditor />} />
              <Route path=":id/edit" element={<BlogEditor />} />
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