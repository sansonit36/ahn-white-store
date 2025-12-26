import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, Phone, MapPin, CheckCircle, Clock, ArrowRight, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Order } from '../types';


export const Checkout: React.FC = () => {
    const { cart, cartTotal, clearCart, addOrder } = useShop();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [timeLeft, setTimeLeft] = useState(600);
    const [showMobileSummary, setShowMobileSummary] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        address: '',
        email: '',
        street: '',
        street: '',
        area: '',
        city: '',
        province: ''
    });

    // Timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((p) => p > 0 ? p - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Track InitiateCheckout
    useEffect(() => {
        if (cart.length === 0) return;

        // Facebook
        if ((window as any).fbq) {
            (window as any).fbq('track', 'InitiateCheckout', {
                content_ids: cart.map(item => item.id),
                content_type: 'product',
                value: cartTotal,
                currency: 'PKR',
                num_items: cart.reduce((acc, item) => acc + item.quantity, 0)
            });
        }

        // TikTok
        if ((window as any).ttq) {
            (window as any).ttq.track('InitiateCheckout', {
                contents: cart.map(item => ({
                    content_id: item.id,
                    content_type: 'product',
                    content_name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                value: cartTotal,
                currency: 'PKR'
            });
        }
    }, []); // Run once on mount

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <Link to="/" className="text-rose-500 hover:underline">Return to Home</Link>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple Regex Validation for Pakistan Phone Number
        const pakPhoneRegex = /^03\d{9}$/;
        if (!pakPhoneRegex.test(phoneNumber)) {
            alert("Please enter a valid Pakistani mobile number (e.g., 03001234567)");
            return;
        }

        setLoading(true);

        // Simulate processing
        setTimeout(() => {
            setLoading(false);
            // Generate random order ID
            const orderId = `AHN-${Math.floor(1000 + Math.random() * 9000)}`;

            const fullAddress = `${formData.address}, ${formData.street}, ${formData.area}, ${formData.province}`;

            const newOrder: Order = {
                id: orderId,
                customerName: formData.fullName,
                phone: phoneNumber,
                email: formData.email, // Make sure this is in formData
                city: formData.city,
                address: fullAddress,
                items: [...cart],
                total: cartTotal,
                date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }),
                status: 'Pending',
                paymentMethod: 'COD'
            };

            const orderDetails = {
                orderId: newOrder.id,
                customer: { ...formData, phone: phoneNumber }, // includes email
                items: newOrder.items,
                total: newOrder.total,
                date: newOrder.date
            };

            addOrder(newOrder); // Save to admin context
            clearCart();
            navigate('/thank-you', { state: orderDetails });
        }, 2000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <div className="min-h-screen bg-[#FDF8F9] pb-20">
            {/* Top Warning Banner */}
            <div className="bg-rose-500 text-white text-center py-2 text-xs md:text-sm font-bold flex justify-center items-center gap-2 sticky top-0 z-40 shadow-md">
                <Clock size={16} className="animate-pulse" />
                High Demand: We are experiencing a high volume of orders.
            </div>

            {/* Mobile Header */}
            <div className="md:hidden border-b border-gray-200 bg-white p-4 flex items-center justify-between sticky top-[32px] z-30">
                <Link to="/" className="font-serif font-bold text-gray-900">AHN <span className="text-rose-500">Checkout</span></Link>
            </div>

            {/* Mobile Order Summary Toggle */}
            <div className="md:hidden bg-gray-50 border-b border-gray-200 sticky top-[89px] z-30">
                <button
                    onClick={() => setShowMobileSummary(!showMobileSummary)}
                    className="w-full flex justify-between items-center p-4 text-sm font-medium text-gray-700"
                >
                    <div className="flex items-center gap-2 text-rose-500">
                        <ShoppingCart size={16} />
                        <span>{showMobileSummary ? 'Hide' : 'Show'} Order Summary</span>
                        {showMobileSummary ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                    <span className="font-bold text-gray-900">Rs. {cartTotal.toLocaleString()}</span>
                </button>

                {showMobileSummary && (
                    <div className="p-4 border-t border-gray-200 bg-white animate-fade-in">
                        <div className="space-y-3 mb-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-3 items-center">
                                    <div className="relative shrink-0">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold">{item.quantity}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                                    </div>
                                    <p className="font-bold text-sm text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-sm font-bold text-gray-900 pt-3 border-t border-gray-100">
                            <span>Total</span>
                            <span>Rs. {cartTotal.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-4 md:py-8">
                <Link to="/" className="hidden md:flex items-center gap-2 mb-8 group w-fit">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-300 to-amber-200 group-hover:scale-110 transition-transform"></div>
                    <span className="font-serif text-2xl font-bold text-gray-900">AHN <span className="text-rose-500">Checkout</span></span>
                </Link>

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 relative">

                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 space-y-6 md:space-y-8">
                        {/* Progress Step */}
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm md:text-base"><CheckCircle size={18} className="md:w-5 md:h-5" /></div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm md:text-base">Cart Reserved</p>
                                    <p className="text-xs text-gray-500">Time remaining: {formatTime(timeLeft)}</p>
                                </div>
                            </div>
                            <div className="hidden md:block h-8 w-px bg-gray-100"></div>
                            <div className="flex items-center gap-3 opacity-100">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm md:text-base">2</div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm md:text-base">Shipping</p>
                                    <p className="text-xs text-gray-500">Enter details below</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-amber-400"></div>

                            <div className="flex items-center justify-between mb-6 md:mb-8">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <MapPin className="text-rose-500" /> Shipping Information
                                </h3>
                                <span className="text-[10px] md:text-xs font-bold bg-green-100 text-green-700 px-2 py-1 md:px-3 rounded-full flex items-center gap-1"><ShieldCheck size={12} /> Secure SSL</span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                                <div className="grid grid-cols-1 gap-5">
                                    <input name="fullName" onChange={handleInputChange} required type="text" placeholder="Full Name" className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm md:text-base" />
                                </div>

                                {/* Phone Verification Block */}
                                <div className="bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 rounded-xl border border-gray-200 relative">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number <span className="text-rose-500">*</span></label>
                                    <div className="flex gap-2">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="03XXXXXXXXX"
                                            className="flex-1 p-3 md:p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 transition-all bg-white text-sm md:text-base font-medium"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Phone size={12} /> We will call you to confirm the order.</p>
                                </div>

                                <div className="space-y-4">
                                    <input name="address" onChange={handleInputChange} required type="text" placeholder="House No / Flat No" className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm md:text-base" />
                                    <input name="street" onChange={handleInputChange} required type="text" placeholder="Street Address / Road" className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm md:text-base" />
                                    <input name="area" onChange={handleInputChange} required type="text" placeholder="Area (e.g., DHA Phase 6)" className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm md:text-base" />
                                    <input name="email" onChange={handleInputChange} type="email" placeholder="Email Address (Optional)" className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm md:text-base" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input name="city" onChange={handleInputChange} required type="text" placeholder="City" className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm md:text-base" />
                                    <select name="province" onChange={handleInputChange} className="w-full p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-gray-50 focus:bg-white text-sm md:text-base">
                                        <option value="">Province</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="Sindh">Sindh</option>
                                        <option value="KPK">Khyber Pakhtunkhwa</option>
                                        <option value="Balochistan">Balochistan</option>
                                        <option value="Islamabad">Islamabad</option>
                                    </select>
                                </div>


                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Truck size={18} /> Delivery Method</h4>
                                    <label className="flex items-center justify-between p-4 md:p-5 border-2 border-rose-500 bg-rose-50/40 rounded-xl cursor-pointer transition-all hover:bg-rose-50">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-[5px] md:border-[6px] border-rose-500 bg-white shadow-sm"></div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm md:text-base">Cash on Delivery (COD)</p>
                                                <p className="text-xs md:text-sm text-gray-500">Pay safely when you receive your order</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-green-600 bg-white px-2 py-1 md:px-3 rounded-full shadow-sm text-xs md:text-sm">Free</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 md:py-5 bg-black text-white rounded-xl font-bold text-base md:text-lg hover:bg-gray-900 transition-all shadow-xl shadow-gray-300 transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                                >
                                    {loading ? (
                                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                                    ) : (
                                        <>COMPLETE ORDER <ArrowRight size={20} /></>
                                    )}
                                </button>
                                <p className="text-center text-[10px] md:text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} />
                                    All transactions are secure and encrypted.
                                </p>
                            </form>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4 grayscale opacity-70">
                            <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-white rounded-xl border border-gray-100 text-center">
                                <ShieldCheck className="mb-2 text-gray-800" size={20} />
                                <span className="text-[10px] md:text-xs font-bold text-gray-700">Money Back</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-white rounded-xl border border-gray-100 text-center">
                                <Truck className="mb-2 text-gray-800" size={20} />
                                <span className="text-[10px] md:text-xs font-bold text-gray-700">Fast Shipping</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-white rounded-xl border border-gray-100 text-center">
                                <CheckCircle className="mb-2 text-gray-800" size={20} />
                                <span className="text-[10px] md:text-xs font-bold text-gray-700">Original Product</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary (Desktop Only - Mobile uses Accordion) */}
                    <div className="hidden lg:block lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h3>

                            {/* Product List */}
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="relative shrink-0">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                                            <span className="absolute -top-2 -right-2 bg-gray-900 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shadow-md">{item.quantity}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate">{item.name}</p>
                                            <p className="text-xs text-rose-500 font-medium animate-pulse">Low Stock - High Demand</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                            <p className="text-xs text-gray-400 line-through">Rs. {(item.originalPrice * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Rs. {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping (Priority)</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold text-gray-900">Rs. {cartTotal.toLocaleString()}</span>
                                        <span className="text-xs text-gray-500">Including GST</span>
                                    </div>
                                </div>
                            </div>

                            {/* Guarantee Box */}
                            <div className="mt-6 bg-gray-50 p-4 rounded-xl flex gap-3 items-start border border-gray-100">
                                <ShieldCheck className="text-gray-900 shrink-0" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Buyer Protection</p>
                                    <p className="text-xs text-gray-500 leading-relaxed mt-1">Get full refund if the item is not as described or if is not delivered.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};