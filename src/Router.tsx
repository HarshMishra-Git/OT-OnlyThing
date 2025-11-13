import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { EnhancedCartPage } from './pages/EnhancedCartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { QuizPage } from './pages/QuizPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { SciencePage } from './pages/SciencePage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { BlogPage } from './pages/BlogPage';
import { AdminPage } from './pages/AdminPage';

export function Router() {
  const path = window.location.pathname;

  if (path === '/' || path === '') {
    return <HomePage />;
  }

  if (path === '/shop') {
    return <ShopPage />;
  }

  if (path.startsWith('/product/')) {
    return <ProductDetailPage />;
  }

  if (path === '/cart') {
    return <EnhancedCartPage />;
  }

  if (path === '/checkout') {
    return <CheckoutPage />;
  }

  if (path === '/order-confirmation') {
    return <OrderConfirmationPage />;
  }

  if (path === '/quiz') {
    return <QuizPage />;
  }

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/signup') {
    return <SignupPage />;
  }

  if (path === '/account') {
    return <AccountPage />;
  }

  if (path === '/about') {
    return <AboutPage />;
  }

  if (path === '/science') {
    return <SciencePage />;
  }

  if (path === '/contact') {
    return <ContactPage />;
  }

  if (path === '/faq') {
    return <FAQPage />;
  }

  if (path === '/blog') {
    return <BlogPage />;
  }

  if (path === '/admin') {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-black mb-4">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-black text-white font-bold text-sm tracking-wide uppercase hover:bg-gray-900 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
