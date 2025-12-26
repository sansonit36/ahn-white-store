import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCT_IMAGE_MAIN, BEFORE_IMAGE, AFTER_IMAGE } from '../constants';
import { Star, Check, ArrowRight, ShieldCheck, Sparkles, XCircle, AlertTriangle, Fingerprint } from 'lucide-react';
import { VerticalVideos } from '../components/VerticalVideos';
import { BeforeAfter } from '../components/BeforeAfter';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { addToCart, products, reviews, pixelConfig } = useShop();

  // Dynamic Content (Fallbacks to constants if not set in Admin)
  const dynamicBefore = pixelConfig.beforeImage || BEFORE_IMAGE;
  const dynamicAfter = pixelConfig.afterImage || AFTER_IMAGE;

  return (
    <main className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-[#FDF8F9] pt-20 pb-12 md:py-0">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] bg-rose-200/30 rounded-full blur-[60px] md:blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] bg-amber-100/40 rounded-full blur-[60px] md:blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          <div className="space-y-4 md:space-y-6 text-center md:text-left order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full shadow-sm border border-rose-100 animate-fade-in-up">
              <div className="flex text-amber-400"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
              <span className="text-[10px] md:text-xs font-semibold text-gray-600 tracking-wide">TRUSTED BY 15,000+ PAKISTANIS</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1] tracking-tight">
              Even Tone.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-amber-500">Clean Glow.</span><br />
              No Harsh Bleach.
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed px-2 md:px-0">
              The gentle brightening cream that targets dark spots, acne marks, and sun tan using <strong>Niacinamide & Alpha Arbutin</strong>.
              <span className="block mt-2 font-medium text-rose-500">0% Mercury. 0% Steroids. 100% Safe.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start px-8 md:px-0">
              <Link to="/ahn-white-plus-whitening-cream" className="px-8 py-4 bg-rose-500 text-white rounded-full font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 flex items-center justify-center gap-2 text-sm md:text-base">
                SHOP NOW <ArrowRight size={18} />
              </Link>
              <a href="#safe-promise" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-colors flex items-center justify-center text-sm md:text-base gap-2">
                <ShieldCheck size={18} /> WHY IT'S SAFE
              </a>
            </div>
          </div>
          <div className="relative group cursor-pointer order-1 md:order-2 px-8 md:px-0">
            <Link to="/ahn-white-plus-whitening-cream">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-amber-100 rounded-[3rem] transform rotate-3 scale-95 group-hover:rotate-0 transition-transform duration-700"></div>
              {/* Use first product image or default main */}
              <img
                src={products[0]?.image || PRODUCT_IMAGE_MAIN}
                alt="AHN White+ Cream"
                className="relative w-full rounded-[3rem] shadow-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-700"
              />
            </Link>
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-2 md:-bottom-6 md:-left-6 bg-white p-3 md:p-4 rounded-2xl shadow-xl animate-bounce duration-[3000ms] z-20">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-green-100 p-1.5 md:p-2 rounded-full text-green-600">
                  <ShieldCheck size={16} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-gray-900">Mercury Free</p>
                  <p className="text-[10px] md:text-xs text-gray-500">Certified Safe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER SLIDER SECTION (DYNAMIC) */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-rose-500 font-bold tracking-wider text-xs md:text-sm uppercase">Visible Transformation</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mt-2 md:mt-3">Real Results (No Filter)</h2>
            <div className="w-16 md:w-20 h-1 bg-amber-400 mx-auto mt-4 md:mt-6"></div>
          </div>

          <div className="max-w-5xl mx-auto relative">
            <BeforeAfter
              beforeImage={dynamicBefore}
              afterImage={dynamicAfter}
            />
            <p className="text-center text-sm text-gray-500 mt-6 italic">*Results based on 4 weeks of consistent use. Individual results may vary.</p>
          </div>
        </div>
      </section>

      {/* PAIN POINTS VS SOLUTION SECTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Why Typical "Whitening" Creams Fail</h2>
            <p className="text-gray-500">Don't risk your skin barrier for a temporary fix.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
              <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
                <XCircle /> The Risky Way
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-red-700/80">
                  <AlertTriangle className="shrink-0 w-5 h-5 mt-0.5" />
                  <span><strong>Contains Steroids:</strong> Thin skin, redness, and acne flares when you stop.</span>
                </li>
                <li className="flex items-start gap-3 text-red-700/80">
                  <AlertTriangle className="shrink-0 w-5 h-5 mt-0.5" />
                  <span><strong>Mercury Risks:</strong> Dangerous health side effects and permanent damage.</span>
                </li>
                <li className="flex items-start gap-3 text-red-700/80">
                  <AlertTriangle className="shrink-0 w-5 h-5 mt-0.5" />
                  <span><strong>Fake Promises:</strong> "7 Day Challenge" usually means harsh bleaching.</span>
                </li>
              </ul>
            </div>

            {/* The AHN Way */}
            <div className="bg-green-50 p-8 rounded-3xl border border-green-100 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                <Check /> The AHN Safe Way
              </h3>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-start gap-3 text-green-800/80">
                  <Sparkles className="shrink-0 w-5 h-5 mt-0.5" />
                  <span><strong>Niacinamide + Alpha Arbutin:</strong> Safe, science-backed brightening actives.</span>
                </li>
                <li className="flex items-start gap-3 text-green-800/80">
                  <Sparkles className="shrink-0 w-5 h-5 mt-0.5" />
                  <span><strong>Barrier Repair:</strong> Glycerin & Allantoin soothe skin and prevent burning.</span>
                </li>
                <li className="flex items-start gap-3 text-green-800/80">
                  <Sparkles className="shrink-0 w-5 h-5 mt-0.5" />
                  <span><strong>Gradual Results:</strong> Real improvement in 3-4 weeks without the rebound.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* INGREDIENT HIGHLIGHT */}
      <section id="safe-promise" className="py-16 bg-[#FDF8F9]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1">
              <span className="text-rose-500 font-bold tracking-wider text-xs md:text-sm uppercase">Transparent Formula</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mt-2 mb-6">What's Inside Matters</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We know the fear of "mix creams". That's why we list every single ingredient. Our formula is designed for the heat, dust, and humidity of Pakistan.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Niacinamide</h4>
                  <p className="text-sm text-gray-500">Controls oil, minimizes pores, and fades dark spots.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Alpha Arbutin</h4>
                  <p className="text-sm text-gray-500">The gold standard for safe skin brightening.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Glycerin</h4>
                  <p className="text-sm text-gray-500">Locks in moisture without making skin greasy.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Allantoin</h4>
                  <p className="text-sm text-gray-500">Soothes irritation and redness instantly.</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white rounded-xl border border-rose-100 flex items-center gap-4">
                <Fingerprint className="text-rose-500 w-10 h-10" />
                <div>
                  <p className="font-bold text-gray-900">100% Original Guarantee</p>
                  <p className="text-xs text-gray-500">Every box comes with a holographic seal and verifiable batch code.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-[4/5] bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white">
                <img
                  src={pixelConfig.safePromiseImage || "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=800"}
                  alt="Safe Ingredients"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
                <p className="font-serif italic text-gray-800 text-lg">"Finally a cream that doesn't burn my skin. The ingredient list gave me peace of mind."</p>
                <p className="text-sm font-bold text-rose-500 mt-2">- Ayesha, Lahore</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* SHOP SECTION */}
      <section id="shop" className="py-16 md:py-24 bg-[#FDF8F9]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-rose-500 font-bold tracking-wider text-xs md:text-sm uppercase">Start Your Routine</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mt-2 md:mt-3">Choose Your Bundle</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {products.map((bundle, idx) => {
              const isBestValue = idx === 1;
              // Link to dedicated page for starter, otherwise dynamic
              const productUrl = bundle.id === 'starter'
                ? '/ahn-white-plus-whitening-cream'
                : `/product/${bundle.id}`;

              return (
                <div key={bundle.id} className={`relative bg-white rounded-3xl border ${isBestValue ? 'border-amber-400 ring-4 ring-amber-50 scale-105 z-10' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all flex flex-col`}>
                  {isBestValue && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white px-4 py-1 md:px-6 md:py-2 rounded-full font-bold text-xs md:text-sm tracking-widest shadow-lg text-center w-max flex items-center gap-2">
                      <Star size={14} fill="currentColor" /> MOST POPULAR
                    </div>
                  )}
                  {bundle.badge && !isBestValue && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-1 md:px-6 md:py-2 rounded-full font-bold text-xs md:text-sm tracking-widest shadow-lg text-center w-max">
                      {bundle.badge}
                    </div>
                  )}

                  <div className="p-6 md:p-8 pb-0 flex-1">
                    <div className="aspect-square bg-[#FDF8F9] rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
                      <Link to={productUrl} className="w-full h-full">
                        <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500" />
                      </Link>
                    </div>
                    <Link to={productUrl}>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 hover:text-rose-500 transition-colors">{bundle.name}</h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mt-2 mb-4">
                      <span className="text-2xl md:text-3xl font-bold text-rose-500">Rs. {bundle.price.toLocaleString()}</span>
                      <span className="text-base md:text-lg text-gray-400 line-through">Rs. {bundle.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="mb-4">
                      <span className="text-[10px] md:text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded inline-block">SAVE Rs. {bundle.savings.toLocaleString()}</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-6">{bundle.description}</p>

                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                        <Check size={16} className="text-green-500 shrink-0" /> Free Priority Shipping
                      </li>
                      <li className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                        <Check size={16} className="text-green-500 shrink-0" /> Sealed & Authentic
                      </li>
                      {bundle.itemsCount > 1 && (
                        <li className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                          <Check size={16} className="text-green-500 shrink-0" /> Best for 6-week course
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="p-6 md:p-8 pt-0 mt-auto">
                    <button
                      onClick={() => addToCart(bundle)}
                      className={`w-full py-3 md:py-4 rounded-xl font-bold transition-all transform active:scale-95 text-sm md:text-base ${bundle.badge
                        ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION (DYNAMIC) */}
      <section id="reviews" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-gray-900 mb-8 md:mb-12">Trusted by 15,000+ Customers</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {(reviews.length > 0 ? reviews : []).slice(0, 6).map((review) => (
              <div key={review.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-rose-100">
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-sm md:text-base text-gray-700 italic mb-6">"{review.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg shadow-inner">
                    {review.user ? review.user.charAt(0) : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{review.user}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Check size={12} className="text-blue-500" /> Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="col-span-3 text-center text-gray-500">No reviews yet. Add them from Admin Panel.</div>
            )}
          </div>
        </div>
      </section>

      <VerticalVideos />
    </main>
  );
};