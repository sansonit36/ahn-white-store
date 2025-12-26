import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { SalesPopup } from './components/SalesPopup';
import { Home } from './pages/Home';
import { Checkout } from './pages/Checkout';
import { Admin } from './pages/Admin';
import { ProductPage } from './pages/ProductPage';
import { ThankYou } from './pages/ThankYou';
import { Login } from './pages/Login';

import { PixelTracker } from './components/PixelTracker';
import { ShieldCheck } from 'lucide-react';
import { ProductTemplate } from './pages/ProductTemplate';
import { AhnWhitePlusPage } from './pages/AhnWhitePlusPage';

// Redirect /product to the first product
const ProductRedirect = () => {
  const { products, isLoading } = useShop();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (products.length > 0) {
    return <Navigate to="/ahn-white-plus-whitening-cream" replace />;
  }
  return <Navigate to="/" replace />;
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';
  const isAdmin = location.pathname === '/admin';
  const isThankYou = location.pathname === '/thank-you';
  const isLogin = location.pathname === '/login';

  return (
    <>
      {!isCheckout && !isAdmin && !isThankYou && !isLogin && <Header />}
      {children}
      <CartDrawer />
      {!isAdmin && !isCheckout && !isThankYou && !isLogin && <SalesPopup />}

      {!isCheckout && !isAdmin && !isThankYou && !isLogin && (
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <span className="font-serif text-2xl font-bold tracking-wide text-white mb-6 block">
              AHN <span className="text-amber-500">White+</span>
            </span>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Premium whitening skincare designed to bring out your natural glow. Dermatologically tested and loved by thousands.</p>

            <div className="border-t border-gray-800 pt-8 flex flex-col items-center gap-4">
              <p className="text-xs text-gray-600">© 2024 AHN White+. All rights reserved.</p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-700 hover:text-gray-500 transition-colors"
              >
                <ShieldCheck size={12} /> Admin Access
              </Link>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

// Simple wrapper for protection
const ProtectedAdmin = ({ children }: { children: JSX.Element }) => {
  const { isAdminMode } = useShop();
  if (!isAdminMode) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ShopProvider>
      <Router>
        <PixelTracker />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<ProductRedirect />} />
            <Route path="/product/:id" element={<ProductTemplate />} />
            <Route path="/ahn-white-plus-whitening-cream" element={<AhnWhitePlusPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedAdmin>
                <Admin />
              </ProtectedAdmin>
            } />
          </Routes>
        </Layout>
      </Router>
    </ShopProvider>
  );
}

export default App;