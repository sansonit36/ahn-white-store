import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCT_IMAGE_MAIN, PRODUCT_IMAGE_OPEN, REVIEWS } from '../constants';
import { Star, Check, ShieldCheck, Truck, Plus, ChevronDown, ChevronUp, Droplets, Sparkles, Sun, Fingerprint, Info, X, AlertOctagon, Moon, Clock, HeartHandshake, Target, Zap, Camera, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VerticalVideos } from '../components/VerticalVideos';
import { BeforeAfter } from '../components/BeforeAfter';

const INGREDIENTS = [
  { name: "Niacinamide (B3)", desc: "Controls oil, reduces pores, and fades dark spots.", icon: Droplets },
  { name: "Alpha Arbutin", desc: "Safe, non-bleaching brightening agent for even tone.", icon: Sparkles },
  { name: "Glycerin", desc: "Locks in hydration to prevent dryness and peeling.", icon: Droplets },
  { name: "Titanium Dioxide", desc: "Physical tone correction and mild UV protection.", icon: Sun },
];

const FAQS = [
  { q: "Does this contain mercury or steroids?", a: "Absolutely not. AHN White+ is 100% free from mercury, hydroquinone, and steroids. We use safe actives like Niacinamide and Alpha Arbutin." },
  { q: "Will my skin get darker if I stop using it?", a: "No. Since we don't use harsh steroids, there is no 'rebound' effect. However, for maintenance, we recommend continued use and always wearing sunscreen." },
  { q: "Is it suitable for sensitive skin?", a: "Yes, the formula is designed to be gentle. However, we always recommend a patch test on your jawline before full application." },
  { q: "When will I see results?", a: "Skincare is gradual. Most users see fresher skin in 7-10 days and significant dark spot reduction in 3-4 weeks of daily use." },
  { q: "How do I know I received the original product?", a: "Every AHN box comes with a holographic seal and a batch code printed on the bottom. If the seal is broken, do not use it and contact us." },
];

const UGC_IMAGES = [
  "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1554196346-b717b9642927?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1556942040-aec072280da8?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
];

export const ProductPage: React.FC = () => {
  const { addToCart, products, pixelConfig } = useShop();
  const [selectedBundleId, setSelectedBundleId] = useState<string>("");
  const [activeImage, setActiveImage] = useState(PRODUCT_IMAGE_MAIN);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Stock Scarcity State
  const [stockLeft, setStockLeft] = useState(14); // Authentic looking low stock number

  // Set default bundle when products load
  useEffect(() => {
    if (products.length > 0 && !selectedBundleId) {
      // Default to the 2nd bundle (Best Value) or 1st if not available
      setSelectedBundleId(products[1]?.id || products[0].id);
    }
  }, [products, selectedBundleId]);

  // Sync activeImage with selected bundle
  useEffect(() => {
    const bundle = products.find(b => b.id === selectedBundleId);
    if (bundle) {
      setActiveImage(bundle.image);
    }
  }, [selectedBundleId, products]);

  // Fix: Use dynamic images from Settings if available, otherwise fallback
  // Tripling loop for smooth scroll
  const sourceImages = (pixelConfig.realGlowImages && pixelConfig.realGlowImages.length > 0)
    ? pixelConfig.realGlowImages
    : UGC_IMAGES;

  const marqueeImages = [...sourceImages, ...sourceImages, ...sourceImages];

  useEffect(() => {
    // Debug logging for troubleshooting
    console.log('ProductPage pixelConfig:', pixelConfig);
    console.log('Source Images:', sourceImages);
  }, [pixelConfig]);

  // Decrease stock counter occasionally for realism (stops at 3)
  useEffect(() => {
    const timer = setInterval(() => {
      setStockLeft((prev) => (prev > 9 ? prev - 1 : prev));
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const selectedBundle = products.find(b => b.id === selectedBundleId) || products[0];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (products.length === 0 || !selectedBundle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Handle Add to Cart with Pixel
  const handleAddToCart = () => {
    // Facebook Pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_name: selectedBundle.name,
        content_ids: [selectedBundle.id],
        content_type: 'product',
        value: selectedBundle.price,
        currency: 'PKR'
      });
    }
    // TikTok Pixel
    if ((window as any).ttq) {
      (window as any).ttq.track('AddToCart', {
        content_name: selectedBundle.name,
        content_id: selectedBundle.id,
        content_type: 'product',
        value: selectedBundle.price,
        currency: 'PKR'
      });
    }

    addToCart(selectedBundle);
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
          <Link to="/" className="hover:text-rose-500">Home</Link> / <span>Shop</span> / <span className="text-gray-900 font-medium">AHN White+ Cream</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20">

          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-3 md:space-y-4">
            <div className="aspect-square bg-[#FDF8F9] rounded-2xl md:rounded-3xl overflow-hidden relative group">
              <img
                src={activeImage}
                alt="AHN White+ Product"
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              />
              {selectedBundle.badge && (
                <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-amber-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {selectedBundle.badge}
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {(selectedBundle.images && selectedBundle.images.length > 0
                ? selectedBundle.images
                : [PRODUCT_IMAGE_MAIN, PRODUCT_IMAGE_OPEN, PRODUCT_IMAGE_MAIN, PRODUCT_IMAGE_OPEN]
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

            <h1 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-3 md:mb-4">AHN White+ Cream</h1>
            <p className="text-gray-500 text-sm md:text-lg mb-4">Even Tone Brightening with Niacinamide & Alpha Arbutin</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 inline-flex items-start gap-2">
              <ShieldCheck className="text-green-600 shrink-0 w-5 h-5" />
              <p className="text-xs md:text-sm text-green-800 font-medium">Safe Formula: No Mercury, No Hydroquinone, No Steroids. 100% Original.</p>
            </div>

            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
              A lightweight daily moisturizer designed to fade dark spots, smooth uneven texture, and brighten dull skin without harsh bleaching. Perfect for Pakistani skin dealing with heat, dust, and sun tan.
            </p>

            {/* BUNDLE SELECTOR */}
            <div className="space-y-4 mb-8">
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex justify-between items-center">
                Select Your Bundle
                <span className="text-xs text-rose-500 font-bold animate-pulse flex items-center gap-1">
                  <Flame size={12} fill="currentColor" /> Only {stockLeft} left at this price
                </span>
              </p>
              {products.map((bundle, idx) => {
                const isBestValue = idx === 1; // Assuming 2nd bundle is best value

                return (
                  <div
                    key={bundle.id}
                    onClick={() => setSelectedBundleId(bundle.id)}
                    className={`relative p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedBundleId === bundle.id
                      ? 'border-amber-400 bg-amber-50/50 ring-1 ring-amber-200'
                      : 'border-gray-200 hover:border-rose-200 bg-white'
                      } ${isBestValue && selectedBundleId !== bundle.id ? 'border-amber-200 bg-amber-50/30' : ''}`}
                  >
                    {/* BEST VALUE RIBBON */}
                    {isBestValue && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide z-10 flex items-center gap-1 whitespace-nowrap">
                        <Star size={10} fill="currentColor" /> MOST POPULAR - BEST VALUE
                      </div>
                    )}

                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedBundleId === bundle.id ? 'border-amber-500' : 'border-gray-300'}`}>
                        {selectedBundleId === bundle.id && <div className="w-3 h-3 rounded-full bg-amber-500" />}
                      </div>
                      <div>
                        <p className={`font-bold text-sm md:text-base ${selectedBundleId === bundle.id ? 'text-gray-900' : 'text-gray-700'}`}>{bundle.name}</p>
                        {bundle.savings > 0 && <p className="text-xs text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded inline-block mt-0.5">Save Rs. {bundle.savings.toLocaleString()}</p>}
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-base md:text-lg text-gray-900">Rs. {bundle.price.toLocaleString()}</span>
                        <span className="text-xs md:text-sm text-gray-400 line-through">Rs. {bundle.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    {/* Keep original badge if exists, but hide if we're showing best value ribbon to avoid clutter, or move it */}
                    {bundle.badge && !isBestValue && (
                      <div className="absolute -top-3 right-4 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        {bundle.badge}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ACTION BUTTON (Mobile Only - moved up) */}
            <div className="block md:hidden mt-6 mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                ADD TO CART — Rs. {selectedBundle.price.toLocaleString()}
              </button>
            </div>

            {/* ACTION BUTTONS (Desktop) */}
            <div className="hidden md:block space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                ADD TO CART — Rs. {selectedBundle.price.toLocaleString()}
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

        {/* --- NEW SECTION: UGC IMAGE SCROLL (INFINITE LOOP) --- */}
        <div className="mb-16 md:mb-24">
          <div className="flex flex-col items-center mb-8 text-center px-4">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-rose-100">
              <Camera size={14} /> @ahnwhiteplus
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900">Real Glow. Real People.</h2>
            <p className="text-gray-500 mt-2 max-w-lg">Tag us to be featured! Join our growing community of radiant skin lovers.</p>
          </div>

          {/* Marquee/Scroll Container */}
          <div className="relative w-full overflow-hidden bg-white py-4">
            {/* Gradient Fade Masks */}
            <div className="absolute top-0 left-0 w-8 md:w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-8 md:w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            {/* Animated Track */}
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

        {/* --- NEW SECTION: SKIN CONCERNS GRID --- */}
        <div className="mb-16 md:mb-24">
          <div className="text-center mb-10">
            <span className="text-rose-500 font-bold tracking-wider text-xs md:text-sm uppercase">Who is this for?</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mt-2">Targeted Skin Concerns</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-amber-50 p-6 rounded-2xl text-center border border-amber-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500 shadow-sm">
                <Sun size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Sun Tan</h3>
              <p className="text-xs text-gray-600">Reduces darkening caused by daily sun exposure.</p>
            </div>
            <div className="bg-rose-50 p-6 rounded-2xl text-center border border-rose-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 shadow-sm">
                <Target size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Dark Spots</h3>
              <p className="text-xs text-gray-600">Fades acne marks and hyperpigmentation.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl text-center border border-blue-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500 shadow-sm">
                <Droplets size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Dullness</h3>
              <p className="text-xs text-gray-600">Hydrates skin for a fresh, glowing look.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500 shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Uneven Tone</h3>
              <p className="text-xs text-gray-600">Balances discoloration for a smooth finish.</p>
            </div>
          </div>
        </div>

        {/* --- US VS THEM SECTION --- */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-900 mb-8">Why AHN is Better Than "Mix Creams"</h2>
          <div className="grid md:grid-cols-2 gap-0 md:gap-8 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            {/* THEM */}
            <div className="bg-red-50 p-8 space-y-6">
              <h3 className="font-bold text-red-900 text-xl flex items-center gap-2"><AlertOctagon className="text-red-500" /> Typical Local Creams</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-red-800">
                  <X className="shrink-0 w-6 h-6 text-red-500 bg-red-100 rounded-full p-1" />
                  <span><strong>Contains Steroids:</strong> Gives instant white result but destroys skin barrier later.</span>
                </li>
                <li className="flex items-start gap-3 text-red-800">
                  <X className="shrink-0 w-6 h-6 text-red-500 bg-red-100 rounded-full p-1" />
                  <span><strong>Greasy & Sticky:</strong> Feels heavy, blocks pores, and causes pimples in humidity.</span>
                </li>
                <li className="flex items-start gap-3 text-red-800">
                  <X className="shrink-0 w-6 h-6 text-red-500 bg-red-100 rounded-full p-1" />
                  <span><strong>Mercury Risk:</strong> Unsafe chemical levels that can cause long-term health issues.</span>
                </li>
              </ul>
            </div>

            {/* US */}
            <div className="bg-green-50 p-8 space-y-6 relative overflow-hidden">
              {/* Decorative blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>

              <h3 className="font-bold text-green-900 text-xl flex items-center gap-2"><Check className="text-green-600" /> AHN White+ Cream</h3>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-start gap-3 text-green-800">
                  <Check className="shrink-0 w-6 h-6 text-white bg-green-500 rounded-full p-1" />
                  <span><strong>Safe Actives:</strong> Uses Niacinamide & Alpha Arbutin for health brightening.</span>
                </li>
                <li className="flex items-start gap-3 text-green-800">
                  <Check className="shrink-0 w-6 h-6 text-white bg-green-500 rounded-full p-1" />
                  <span><strong>Water-Gel Texture:</strong> Absorbs in seconds, zero oiliness, perfect for hot weather.</span>
                </li>
                <li className="flex items-start gap-3 text-green-800">
                  <Check className="shrink-0 w-6 h-6 text-white bg-green-500 rounded-full p-1" />
                  <span><strong>Lab Tested Safe:</strong> No mercury, no steroids, certified safe for daily use.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- HOW TO USE (ROUTINE) SECTION --- */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-900 mb-4">Simple Daily Routine</h2>
          <p className="text-center text-gray-500 mb-10">For best results, follow this simple 3-step guide.</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:border-rose-200 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-rose-500">
                <Droplets size={32} />
              </div>
              <div className="inline-block bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-1 rounded mb-3">STEP 1</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Cleanse</h3>
              <p className="text-sm text-gray-600">Wash your face with a gentle face wash to remove oil and dust. Pat dry.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center border-2 border-rose-100 shadow-lg relative transform md:-translate-y-2">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                Use Day & Night
              </div>
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-rose-500">
                <Sparkles size={32} />
              </div>
              <div className="inline-block bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-1 rounded mb-3">STEP 2</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Apply AHN White+</h3>
              <p className="text-sm text-gray-600">Take a pea-sized amount and gently massage into skin until fully absorbed.</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:border-rose-200 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-amber-500">
                <Sun size={32} />
              </div>
              <div className="inline-block bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded mb-3">STEP 3 (Morning)</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Protect</h3>
              <p className="text-sm text-gray-600">Crucial: Always apply sunblock in the morning to prevent dark spots coming back.</p>
            </div>
          </div>
        </div>

        {/* AUTHENTICITY CHECKLIST */}
        <div className="mb-16 md:mb-24 bg-rose-50 rounded-3xl p-8 md:p-12 border border-rose-100">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-900 mb-8">How to Verify Your AHN Cream</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-4"><Fingerprint /></div>
              <h3 className="font-bold text-gray-900 mb-2">Holographic Seal</h3>
              <p className="text-sm text-gray-600">Ensure the outer wrap seal is intact and not tampered with.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-4"><ShieldCheck /></div>
              <h3 className="font-bold text-gray-900 mb-2">Batch Code</h3>
              <p className="text-sm text-gray-600">Printed on the bottom of the jar (not a sticker).</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-4"><Droplets /></div>
              <h3 className="font-bold text-gray-900 mb-2">Texture Check</h3>
              <p className="text-sm text-gray-600">Cream should be milky white, non-greasy, and absorb quickly.</p>
            </div>
          </div>
        </div>



        // ... existing code ...

        {/* DETAILED INGREDIENTS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-24">
          {INGREDIENTS.map((ing, i) => (
            <div key={i} className="bg-gray-50 p-6 md:p-8 rounded-2xl text-center hover:bg-rose-50 transition-colors duration-300">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto bg-white rounded-full flex items-center justify-center text-rose-500 mb-4 shadow-sm">
                <ing.icon size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="font-serif font-bold text-base md:text-lg text-gray-900 mb-2">{ing.name}</h3>
              <p className="text-gray-600 text-xs md:text-sm">{ing.desc}</p>
            </div>
          ))}
        </div>



        {/* --- VIDEO SECTION --- */}
        <div className="mb-16">
          <VerticalVideos />
        </div>

        {/* --- GUARANTEE SECTION --- */}
        {/* --- GUARANTEE SECTION --- */}
        <div className="bg-white border-2 border-dashed border-amber-200 rounded-3xl p-8 md:p-12 text-center mb-16 md:mb-24 relative overflow-hidden group hover:border-amber-300 transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-[80px] opacity-50 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 rounded-full blur-[80px] opacity-50 -translate-x-1/3 translate-y-1/3"></div>

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
            <p className="text-xs text-gray-400 mt-4">*Terms & Conditions Apply</p>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 md:mb-12">Common Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex justify-between items-center p-4 md:p-5 bg-white text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 text-sm md:text-base pr-8">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-gray-400 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="p-4 md:p-5 pt-0 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWS LIST SECTION */}
        <div id="product-reviews" className="mb-16 md:mb-24 scroll-mt-24">
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Real Customer Reviews</h2>
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 bg-gray-50 px-6 py-3 rounded-full">
              <div className="flex text-amber-400">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <span className="text-lg font-bold text-gray-900">4.9/5</span>
              <span className="text-gray-400 hidden md:inline">|</span>
              <span className="text-sm md:text-base text-gray-600">Based on 1,240 reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-base md:text-lg shadow-inner">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm md:text-base">{review.user}</p>
                      <div className="flex text-amber-400 text-[10px] md:text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] md:text-xs text-gray-400">{Math.floor(Math.random() * 10) + 1} days ago</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">"{review.comment}"</p>
                {review.rating >= 4 && (
                  <div className="mt-3 flex items-center gap-1 text-[10px] md:text-xs text-green-600 font-medium">
                    <Check size={14} /> Verified Purchase
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="px-6 py-3 border border-gray-300 rounded-full text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm">
              Load More Reviews
            </button>
          </div>
        </div>

      </div>

      {/* MOBILE STICKY FOOTER (High Urgency Version) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-slide-up">
        {/* Scarcity Bar */}
        <div className="bg-amber-100 text-amber-800 text-[10px] py-1 text-center font-bold flex justify-center gap-2 items-center tracking-wide border-t border-amber-200">
          🔥 High Demand: {stockLeft} bundles remaining
        </div>

        {/* Main Footer Content */}
        <div className="bg-white border-t border-gray-200 p-3 px-4 flex gap-3 items-center">
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-gray-400 line-through">Rs. {selectedBundle.originalPrice.toLocaleString()}</span>
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">
                Save Rs. {selectedBundle.savings.toLocaleString()}
              </span>
            </div>
            <p className="font-bold text-gray-900 text-xl leading-none">Rs. {selectedBundle.price.toLocaleString()}</p>
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