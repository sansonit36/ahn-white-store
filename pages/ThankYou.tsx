import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Phone, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface OrderState {
    orderId: string;
    customer: {
        fullName: string;
        phone: string;
        city: string;
    };
    items: CartItem[];
    total: number;
    date: string;
}

export const ThankYou: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as OrderState;

    const hasTracked = React.useRef(false);

    // Import helper (assuming dynamic import or top-level import, but let's use dynamic here or top level if possible, 
    // but since replace_file_content can't add top-level imports easily without context, I'll update the whole file import section too? 
    // No, I'll just assume standard import if I can, or use require? No, it's TSX.
    // I will use a separate tool call to add the import if needed, or just rewrite the top of the file.
    // Actually, I'll rewrite the whole file component logic to be safe.)

    // ... wait, I need to add the import at the top first. I'll do that in a separate tool call or just replace the imports block.
    // Let's replace the useEffect block first, assuming standard import.

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!state) {
            navigate('/');
            return;
        }

        // Prevent duplicate tracking
        if (hasTracked.current) return;
        hasTracked.current = true;

        const trackEvents = async () => {
            // Import dynamically to avoid top-level issues if I can't edit top easily
            const { sha256 } = await import('../lib/utils');

            // Hashing PII
            const hashedPhone = await sha256(state.customer.phone);
            // Email is not captured in checkout currently, but if we had it:
            // const hashedEmail = await sha256(state.customer.email);

            // TikTok Identify
            if ((window as any).ttq) {
                (window as any).ttq.identify({
                    "phone_number": hashedPhone,
                    // "email": hashedEmail 
                });
            }

            // Track Purchase (Frontend)
            // FB
            if ((window as any).fbq) {
                (window as any).fbq('track', 'Purchase', {
                    content_name: 'Order ' + state.orderId,
                    content_ids: state.items.map(i => i.id),
                    content_type: 'product',
                    value: state.total,
                    currency: 'PKR',
                    num_items: state.items.reduce((acc, i) => acc + i.quantity, 0)
                });
            }
            // TikTok (Strict format)
            if ((window as any).ttq) {
                (window as any).ttq.track('PlaceAnOrder', {
                    contents: state.items.map(i => ({
                        content_id: i.id,
                        content_type: 'product',
                        content_name: i.name,
                        quantity: i.quantity,
                        price: i.price
                    })),
                    value: state.total,
                    currency: 'PKR'
                });
            }
        };

        // Execute tracking
        trackEvents();

    }, [state, navigate]);

    if (!state) return null;

    return (
        <div className="min-h-screen bg-[#FDF8F9] pt-24 pb-12 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">

                {/* Success Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-amber-400"></div>

                    <div className="p-8 md:p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <CheckCircle size={40} strokeWidth={3} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-500">Thank you for your purchase, <span className="font-semibold text-gray-800">{state.customer.fullName}</span>.</p>

                        <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100 inline-block">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Order Number</p>
                            <p className="text-2xl font-mono font-bold text-rose-500 tracking-wider">{state.orderId}</p>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gray-50 p-8 md:p-12 border-t border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ShoppingBag size={18} /> Order Summary
                        </h2>

                        <div className="space-y-4 mb-8">
                            {state.items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-xl border border-gray-200">
                                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-gray-900 text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center py-4 border-t border-gray-200">
                            <span className="text-gray-600">Total Amount (COD)</span>
                            <span className="text-2xl font-bold text-gray-900">Rs. {state.total.toLocaleString()}</span>
                        </div>

                        {/* Instructions */}
                        <div className="mt-8 grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
                                    <Truck size={18} /> Delivery Status
                                </div>
                                <p className="text-sm text-blue-700 leading-relaxed">
                                    Your order will be delivered to <span className="font-semibold">{state.customer.city}</span> within 2-4 working days.
                                </p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <div className="flex items-center gap-2 text-amber-800 font-bold mb-2">
                                    <Phone size={18} /> Confirmation
                                </div>
                                <p className="text-sm text-amber-700 leading-relaxed">
                                    You will receive a call on <span className="font-semibold">{state.customer.phone}</span> to confirm your address.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 text-center">
                            <Link to="/" className="inline-flex items-center gap-2 text-rose-500 font-bold hover:text-rose-600 transition-colors">
                                <ArrowRight size={20} className="rotate-180" /> Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};