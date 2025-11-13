import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Public Pages
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import BlogPage from '@/pages/BlogPage';
import FAQPage from '@/pages/FAQPage';
import SciencePage from '@/pages/SciencePage';
import QuizPage from '@/pages/QuizPage';

// Auth Pages
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

// User Pages
import AccountPage from '@/pages/AccountPage';

// Admin Pages
import AdminPage from '@/pages/AdminPage';
import { ProductsListPage } from '@/admin/pages/ProductsListPage';
import { ProductFormPage } from '@/admin/pages/ProductFormPage';
import { OrdersListPage } from '@/admin/pages/OrdersListPage';
import { OrderDetailPage } from '@/admin/pages/OrderDetailPage';
import { QueriesListPage } from '@/admin/pages/QueriesListPage';
import { QueryDetailPage } from '@/admin/pages/QueryDetailPage';
import { BlogListPage } from '@/admin/pages/BlogListPage';
import { BlogFormPage } from '@/admin/pages/BlogFormPage';
import { ReviewsListPage } from '@/admin/pages/ReviewsListPage';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
        Go back home
      </a>
    </div>
  </div>
);

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/science" element={<SciencePage />} />
          <Route path="/quiz" element={<QuizPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected User Routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/edit/:id" element={<ProductFormPage />} />
          <Route path="orders" element={<OrdersListPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="queries" element={<QueriesListPage />} />
          <Route path="queries/:id" element={<QueryDetailPage />} />
          <Route path="blog" element={<BlogListPage />} />
          <Route path="blog/new" element={<BlogFormPage />} />
          <Route path="blog/edit/:id" element={<BlogFormPage />} />
          <Route path="reviews" element={<ReviewsListPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}