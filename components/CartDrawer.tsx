import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Clock, Zap, ShieldCheck, Flame } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, toggleCart, cart, addToCart, removeFromCart, cartTotal } = useShop();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (isCartOpen) {
      setTimeLeft(600); // Reset timer when cart opens
      const timer = setInterval(() => {
        setTimeLeft((p) => p > 0 ? p - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCartOpen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCheckout = () => {
    // Facebook Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_ids: cart.map(item => item.id),
        content_type: 'product',
        value: cartTotal,
        currency: 'PKR',
        num_items: cart.reduce((acc, item) => acc + item.quantity, 0)
      });
    }
    // TikTok Pixel
    if ((window as any).ttq) {
      (window as any).ttq.track('InitiateCheckout', {
        contents: cart.map(item => ({
          content_id: item.id,
          content_name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        value: cartTotal,
        currency: 'PKR'
      });
    }

    toggleCart();
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={toggleCart}></div>
      <div className="absolute right-0 top-0 h-full w-full md:max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300">

        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
            Your Cart <span className="text-sm font-sans font-normal text-gray-500">({cart.length} items)</span>
          </h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-900" />
          </button>
        </div>

        {/* Urgency Bar */}
        <div className="bg-gray-900 text-white py-2 md:py-3 px-4 md:px-6 flex justify-between items-center text-xs md:text-sm font-medium">
          <div className="flex items-center gap-2 text-rose-300">
            <Clock size={16} />
            <span>Reserved for {formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame size={16} className="text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-[10px] md:text-xs">High Demand</span>
          </div>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-rose-100">
          <div className="flex items-center gap-2 text-green-700 font-bold text-xs md:text-sm mb-2">
            <Zap size={16} fill="currentColor" />
            <span>Free Priority Shipping Unlocked!</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-full rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
              <p className="text-sm">Looks like you haven't added anything yet.</p>
              <button onClick={toggleCart} className="mt-4 px-8 py-3 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-transform active:scale-95">Start Shopping</button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3 md:gap-4 transition-all hover:shadow-md group">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {item.itemsCount > 1 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1 font-medium">{item.itemsCount} Pack</span>}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight text-sm md:text-base">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-1"><X size={14} /></button>
                      </div>
                      <p className="text-rose-500 font-bold mt-1 text-sm md:text-base">Rs. {item.price.toLocaleString()}</p>
                      <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1 mt-1"><Flame size={10} fill="currentColor" /> Only 4 left at this price</p>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-white rounded-l-lg transition-colors" onClick={() => removeFromCart(item.id)}><Minus size={12} /></button>
                        <span className="w-6 md:w-8 text-center text-xs md:text-sm font-medium">{item.quantity}</span>
                        <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-white rounded-r-lg transition-colors" onClick={() => addToCart(item)}><Plus size={12} /></button>
                      </div>
                      <span className="text-xs text-gray-500 font-medium line-through">Rs. {(item.originalPrice * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="bg-white p-4 md:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20 pb-8 md:pb-6">
            <div className="space-y-3 mb-4 md:mb-6">
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500 text-sm">
                <span>Shipping</span>
                <span className="text-green-600 font-bold flex items-center gap-1"><Zap size={12} fill="currentColor" /> FREE</span>
              </div>
              <div className="h-px bg-gray-100 my-2"></div>
              <div className="flex justify-between items-center text-lg md:text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              SECURE CHECKOUT <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              <ShieldCheck size={14} />
              <span>Guaranteed Safe Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};