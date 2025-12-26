import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, ProductBundle, Order, PixelConfig, LiveStats, Media, Review } from '../types';
import { BUNDLES } from '../constants';
import { api } from '../lib/api';

interface ShopContextType {
  // Store Data
  products: ProductBundle[];
  updateProduct: (id: string, updates: Partial<ProductBundle>) => void;
  addProduct: (product: ProductBundle) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (bundle: ProductBundle) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  cartTotal: number;

  // Admin & Orders
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  login: (token: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;

  // Marketing
  pixelConfig: PixelConfig;
  updatePixelConfig: (config: Partial<PixelConfig>) => void;

  // Live View
  liveStats: LiveStats;

  // Media
  media: Media[];
  addMedia: (media: Omit<Media, 'id'>) => void;
  deleteMedia: (id: string) => void;

  // Reviews
  reviews: Review[];

  deleteReview: (id: number) => void;

  // Loading State
  isLoading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children?: ReactNode }) => {
  // -- Products (Synced with Backend) --
  const [products, setProducts] = useState<ProductBundle[]>([]);

  // -- Cart State --
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // -- Admin State --
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Auth: Check session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setIsAdminMode(true);
          } else {
            // Token invalid/expired
            localStorage.removeItem('admin_token');
            setIsAdminMode(false);
          }
        } catch (e) {
          console.error("Auth check failed", e);
          setIsAdminMode(false);
        }
      }
    };
    checkAuth();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('admin_token', token);
    setIsAdminMode(true);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) { console.error(e) }
    localStorage.removeItem('admin_token');
    setIsAdminMode(false);
  };

  // expose login/logout via toggleAdminMode just for compatibility or explicit new functions?
  // We'll replace toggle with logout, and provide new login function if needed
  // For context interface compatibility, let's keep toggle but make it logout basically
  const toggleAdminMode = logout;

  // -- Marketing State --
  const [pixelConfig, setPixelConfig] = useState<PixelConfig>({
    facebookPixelId: '',
    facebookCAPIToken: '',
    tiktokPixelId: '',
    tiktokCAPIToken: ''
  });

  // -- Live Stats Simulation --
  const [liveStats, setLiveStats] = useState<LiveStats>({
    activeVisitors: 42,
    activeCarts: 8,
    activeCheckouts: 2,
    recentPurchases: 12,
    salesToday: 0
  });

  // -- Media State --
  const [media, setMedia] = useState<Media[]>([]);

  // -- Reviews State --
  const [reviews, setReviews] = useState<Review[]>([]);

  // -- Initial Loading State --
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProducts, fetchedSettings, fetchedMedia, fetchedReviews] = await Promise.all([
          api.getProducts(),
          api.getSettings(),
          api.getMedia(),
          api.getReviews()
        ]);
        setProducts(fetchedProducts);
        if (fetchedSettings) {
          setPixelConfig(fetchedSettings);
        }
        if (fetchedMedia) {
          setMedia(fetchedMedia);
        }
        if (fetchedReviews) {
          setReviews(fetchedReviews);
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch Orders only when Admin Mode is active
  useEffect(() => {
    if (isAdminMode) {
      api.getOrders().then(setOrders).catch(console.error);
    }
  }, [isAdminMode]);

  // Simulator for Live View
  // Real Analytics: Heartbeat & Live Stats
  useEffect(() => {
    // Generate session ID if not exists
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('session_id', sessionId);
    }

    const heartbeat = () => {
      api.heartbeat({
        id: sessionId!,
        hasCart: cart.length > 0,
        isCheckout: window.location.hash.includes('checkout') // HashRouter uses hash
      }).catch(e => console.error("Heartbeat failed", e));
    };

    // Initial heartbeat
    heartbeat();

    // Heartbeat every 15s
    const hbInterval = setInterval(heartbeat, 15000);

    // Poll live stats if Admin
    let statsInterval: NodeJS.Timeout;
    if (isAdminMode) {
      const fetchStats = async () => {
        try {
          const stats = await api.getLiveStats();
          setLiveStats(stats);
        } catch (e) {
          console.error("Failed to fetch live stats", e);
        }
      };
      fetchStats();
      statsInterval = setInterval(fetchStats, 5000);
    }

    return () => {
      clearInterval(hbInterval);
      if (statsInterval) clearInterval(statsInterval);
    };
  }, [isAdminMode, cart.length]);

  // -- Actions --

  const addToCart = (bundle: ProductBundle) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === bundle.id);
      if (existing) {
        return prev.map(item => item.id === bundle.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...bundle, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  // const toggleAdminMode = () => setIsAdminMode(!isAdminMode); // Replaced by logout

  const addOrder = async (order: Order) => {
    try {
      const newOrder = await api.createOrder(order);
      setOrders(prev => [newOrder, ...prev]);
      setLiveStats(prev => ({ ...prev, recentPurchases: prev.recentPurchases + 1 }));
    } catch (e) {
      console.error("Failed to add order", e);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await api.updateOrder(id, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await api.deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (e) {
      console.error("Failed to delete order", e);
    }
  };

  const updateProduct = async (id: string, updates: Partial<ProductBundle>) => {
    try {
      // Optimistic update
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      await api.updateProduct(id, updates);
    } catch (e) {
      console.error("Failed to update product", e);
      // Revert if needed (not implemented for simplicity)
    }
  };

  const addProduct = async (product: ProductBundle) => {
    try {
      const newProduct = await api.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
    } catch (e) {
      console.error("Failed to add product", e);
    }
  };

  const updatePixelConfig = async (config: Partial<PixelConfig>) => {
    try {
      setPixelConfig(prev => ({ ...prev, ...config })); // Optimistic
      await api.updateSettings(config);
    } catch (e) {
      console.error("Failed to update settings", e);
    }
  };

  const addMedia = async (mediaItem: Omit<Media, 'id'>) => {
    try {
      const newMedia = await api.addMedia(mediaItem);
      setMedia(prev => [newMedia, ...prev]);
    } catch (e) {
      console.error("Failed to add media", e);
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      await api.deleteMedia(id);
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error("Failed to delete media", e);
    }
  };

  const createReview = async (review: Omit<Review, 'id'>) => {
    try {
      const newReview = await api.createReview(review);
      setReviews(prev => [newReview, ...prev]);
    } catch (e) {
      console.error("Failed to create review", e);
    }
  };

  const deleteReview = async (id: number) => {
    try {
      await api.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error("Failed to delete review", e);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <ShopContext.Provider value={{
      cart, isCartOpen, addToCart, removeFromCart, clearCart, toggleCart, cartTotal,
      isAdminMode, toggleAdminMode, login,
      products, updateProduct, addProduct,
      orders, addOrder, updateOrderStatus, deleteOrder,
      pixelConfig, updatePixelConfig,
      liveStats,
      media, addMedia, deleteMedia,
      reviews, createReview, deleteReview,
      isLoading
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};