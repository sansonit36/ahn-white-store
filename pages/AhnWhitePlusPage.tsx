import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCT_IMAGE_MAIN } from '../constants';
import { Star, Check, ShieldCheck, Truck, ChevronDown, Droplets, Sparkles, Sun, Fingerprint, Info, Camera, Flame, HeartHandshake } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BeforeAfter } from '../components/BeforeAfter';

const UGC_IMAGES = [
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1554196346-b717b9642927?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1556942040-aec072280da8?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
];

export const AhnWhitePlusPage: React.FC = () => {
    const navigate = useNavigate();
    const { addToCart, products, pixelConfig, isLoading } = useShop();

    const [activeImage, setActiveImage] = useState(PRODUCT_IMAGE_MAIN);
    const [stockLeft, setStockLeft] = useState(14);

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    // FORCE SELECT "starter" PRODUCT (Product 1)
    const selectedProduct = products.find(p => p.id === 'starter') || products[0];

    if (!selectedProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                <p className="text-gray-500 mb-4">We couldn't load the requested product.</p>
                <div className="bg-gray-100 p-4 rounded text-xs font-mono text-left mb-4">
                    <p>Products Loaded: {products.length}</p>
                    <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-rose-500 text-white rounded-full font-bold"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Sync activeImage with selected product
    useEffect(() => {
        if (selectedProduct) {
            setActiveImage(selectedProduct.image);
        }
    }, [selectedProduct]);

    // Handle marquee images
    const sourceImages = (pixelConfig.realGlowImages && pixelConfig.realGlowImages.length > 0)
        ? pixelConfig.realGlowImages
        : UGC_IMAGES;
    const marqueeImages = [...sourceImages, ...sourceImages, ...sourceImages];

    // Stock ticker
    useEffect(() => {
        const timer = setInterval(() => {
            setStockLeft((prev) => (prev > 9 ? prev - 1 : prev));
        }, 45000);
        return () => clearInterval(timer);
    }, []);

    // Pixel Tracking
    useEffect(() => {
        if (selectedProduct && (window as any).ttq) {
            (window as any).ttq.track('ViewContent', {
                contents: [{
                    content_id: selectedProduct.id,
                    content_type: 'product',
                    content_name: selectedProduct.name,
                    price: selectedProduct.price,
                    quantity: 1
                }],
                value: selectedProduct.price,
                currency: 'PKR'
            });
        }
    }, [selectedProduct]);

    // Add to Cart Handler
    const handleAddToCart = () => {
        // Facebook Pixel
        if ((window as any).fbq) {
            (window as any).fbq('track', 'AddToCart', {
                content_name: selectedProduct.name,
                content_ids: [selectedProduct.id],
                content_type: 'product',
                value: selectedProduct.price,
                currency: 'PKR'
            });
        }
        // TikTok Pixel
        if ((window as any).ttq) {
            (window as any).ttq.track('AddToCart', {
                contents: [{
                    content_id: selectedProduct.id,
                    content_type: 'product',
                    content_name: selectedProduct.name,
                    quantity: 1,
                    price: selectedProduct.price
                }],
                value: selectedProduct.price,
                currency: 'PKR'
            });
        }

        addToCart(selectedProduct);
    };

    // Switch to other bundles if clicked
    const handleBundleSelect = (bundleId: string) => {
        if (bundleId === 'starter') return; // Already here
        navigate(`/product/${bundleId}`); // Route others to dynamic page
        window.scrollTo(0, 0);
    };

    return (
        <div className="pt-28 md:pt-28 pb-32 md:pb-12 bg-white min-h-screen">
            <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

            {/* Breadcrumbs */}
            <div className="container mx-auto px-4 mb-4 md:mb-6">
                <div className="text-xs md:text-sm text-gray-500 flex items-center gap-2">
                    <Link to="/" className="hover:text-rose-500">Home</Link> / <span>Shop</span> / <span className="text-gray-900 font-medium">AHN White+ Whitening Cream</span>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20">

                    {/* LEFT: IMAGE GALLERY */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="aspect-square bg-[#FDF8F9] rounded-2xl md:rounded-3xl overflow-hidden relative group">
                            <img
                                src={activeImage}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                            />
                            {selectedProduct.badge && (
                                <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-amber-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                    {selectedProduct.badge}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-2 md:gap-4">
                            {(selectedProduct.images && selectedProduct.images.length > 0
                                ? selectedProduct.images
                                : [selectedProduct.image] // Fallback if no gallery
                            ).slice(0, 4).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`aspect-square rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-rose-500 ring-2 ring-rose-100' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT INFO */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-amber-400">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" />)}
                            </div>
                            <span className="text-xs md:text-sm text-gray-500 underline decoration-gray-300 underline-offset-4">1,240 Reviews</span>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-3 md:mb-4">AHN White+ Whitening Cream</h1>
                        <p className="text-gray-500 text-sm md:text-lg mb-4">{selectedProduct.description || "Even Tone Brightening with Niacinamide & Alpha Arbutin"}</p>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 inline-flex items-start gap-2">
                            <ShieldCheck className="text-green-600 shrink-0 w-5 h-5" />
                            <p className="text-xs md:text-sm text-green-800 font-medium">Safe Formula: No Mercury, No Hydroquinone, No Steroids. 100% Original.</p>
                        </div>

                        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                            A lightweight daily moisturizer designed to fade dark spots, smooth uneven texture, and brighten dull skin without harsh bleaching. Perfect for Pakistani skin dealing with heat, dust, and sun tan.
                        </p>

                        {/* BUNDLE/VARIANT SELECTOR */}
                        <div className="space-y-4 mb-8">
                            <p className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex justify-between items-center">
                                Select Option
                                <span className="text-xs text-rose-500 font-bold animate-pulse flex items-center gap-1">
                                    <Flame size={12} fill="currentColor" /> Only {stockLeft} left at this price
                                </span>
                            </p>
                            {products.map((bundle, idx) => {
                                const isBestValue = idx === 1;

                                return (
                                    <div
                                        key={bundle.id}
                                        onClick={() => handleBundleSelect(bundle.id)}
                                        className={`relative p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedProduct.id === bundle.id
                                            ? 'border-amber-400 bg-amber-50/50 ring-1 ring-amber-200'
                                            : 'border-gray-200 hover:border-rose-200 bg-white'
                                            } ${isBestValue && selectedProduct.id !== bundle.id ? 'border-amber-200 bg-amber-50/30' : ''}`}
                                    >
                                        {/* BEST VALUE RIBBON */}
                                        {isBestValue && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide z-10 flex items-center gap-1 whitespace-nowrap">
                                                <Star size={10} fill="currentColor" /> MOST POPULAR - BEST VALUE
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedProduct.id === bundle.id ? 'border-amber-500' : 'border-gray-300'}`}>
                                                {selectedProduct.id === bundle.id && <div className="w-3 h-3 rounded-full bg-amber-500" />}
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm md:text-base ${selectedProduct.id === bundle.id ? 'text-gray-900' : 'text-gray-700'}`}>{bundle.name}</p>
                                                {bundle.savings > 0 && <p className="text-xs text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded inline-block mt-0.5">Save Rs. {bundle.savings.toLocaleString()}</p>}
                                            </div>
                                        </div>
                                        <div className="text-right ml-2">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-base md:text-lg text-gray-900">Rs. {bundle.price.toLocaleString()}</span>
                                                <span className="text-xs md:text-sm text-gray-400 line-through">Rs. {bundle.originalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {bundle.badge && !isBestValue && (
                                            <div className="absolute -top-3 right-4 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                                {bundle.badge}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* ACTION BUTTON (Desktop) */}
                        <div className="hidden md:block space-y-4">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                            >
                                ADD TO CART — Rs. {selectedProduct.price.toLocaleString()}
                            </button>

                            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Truck size={14} /> Free Delivery</span>
                                <span className="flex items-center gap-1"><ShieldCheck size={14} /> Cash On Delivery</span>
                                <span className="flex items-center gap-1"><Fingerprint size={14} /> 100% Original</span>
                            </div>
                        </div>
                        {/* MANDATORY DISCLAIMER */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 flex gap-3 items-start">
                            <Info className="text-gray-400 shrink-0 w-5 h-5 mt-0.5" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                <strong>Disclaimer:</strong> Results vary from person to person. This product supports gradual brightening and even tone with regular use. We recommend a patch test before full application.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- BEFORE / AFTER SECTION (DYNAMIC) --- */}
                <div className="mb-16 md:mb-24">
                    <div className="text-center mb-10 md:mb-12">
                        <span className="text-rose-500 font-bold tracking-wider text-xs md:text-sm uppercase">Visible Transformation</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mt-2 md:mt-3">Real Results (No Filter)</h2>
                        <div className="w-16 md:w-20 h-1 bg-amber-400 mx-auto mt-4 md:mt-6"></div>
                    </div>
                    <div className="max-w-5xl mx-auto relative">
                        <BeforeAfter
                            beforeImage={pixelConfig.beforeImage}
                            afterImage={pixelConfig.afterImage}
                        />
                        <p className="text-center text-sm text-gray-500 mt-6 italic">*Results based on 4 weeks of consistent use. Individual results may vary.</p>
                    </div>
                </div>

                {/* --- UGC IMAGE SCROLL --- */}
                <div className="mb-16 md:mb-24">
                    <div className="flex flex-col items-center mb-8 text-center px-4">
                        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-rose-100">
                            <Camera size={14} /> @ahnwhiteplus
                        </div>
                        <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900">Real Glow. Real People.</h2>
                        <p className="text-gray-500 mt-2 max-w-lg">Tag us to be featured! Join our growing community of radiant skin lovers.</p>
                    </div>

                    <div className="relative w-full overflow-hidden bg-white py-4">
                        <div className="absolute top-0 left-0 w-8 md:w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-8 md:w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                        <div className="flex w-max animate-scroll">
                            {marqueeImages.map((img, i) => (
                                <div key={i} className="shrink-0 w-64 h-80 md:w-80 md:h-[450px] mx-3 md:mx-4 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100 relative cursor-pointer">
                                    <img src={img} alt="UGC" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- GUARANTEE SECTION --- */}
                <div className="bg-white border-2 border-dashed border-amber-200 rounded-3xl p-8 md:p-12 text-center mb-16 md:mb-24 relative overflow-hidden group hover:border-amber-300 transition-colors">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 text-amber-500 shadow-sm border border-amber-100 group-hover:scale-110 transition-transform duration-500">
                            <HeartHandshake size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">14-Day Money Back Guarantee</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg mb-8 leading-relaxed">
                            We are so confident in the power of <span className="text-rose-500 font-bold">AHN White+</span> that we offer a full refund if you don't see results. No complicated forms, no questions asked.
                        </p>
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 hover:-translate-y-1 flex items-center gap-2"
                            >
                                <ShieldCheck size={18} /> Try Risk-Free Today
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* MOBILE STICKY FOOTER */}
            <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-slide-up">
                <div className="bg-amber-100 text-amber-800 text-[10px] py-1 text-center font-bold flex justify-center gap-2 items-center tracking-wide border-t border-amber-200">
                    🔥 High Demand: {stockLeft} bundles remaining
                </div>
                <div className="bg-white border-t border-gray-200 p-3 px-4 flex gap-3 items-center">
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-gray-400 line-through">Rs. {selectedProduct.originalPrice.toLocaleString()}</span>
                            {selectedProduct.savings > 0 && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">
                                    Save Rs. {selectedProduct.savings.toLocaleString()}
                                </span>
                            )}
                        </div>
                        <p className="font-bold text-gray-900 text-xl leading-none">Rs. {selectedProduct.price.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="flex-[1.5] bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        Add to Cart <ChevronDown size={16} className="-rotate-90" />
                    </button>
                </div>
            </div>
        </div>
    );
};
