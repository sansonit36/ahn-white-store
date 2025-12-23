import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShieldCheck, LayoutDashboard, ShoppingBag, Package,
  BarChart3, Users, ArrowUp, ArrowDown, Globe,
  Edit, Save, Plus, DollarSign, Image as ImageIcon, Calendar, ChevronDown,
  Eye, Trash2, Search, Filter, X, MapPin, Phone, Upload, PlayCircle, Star, MessageSquare
} from 'lucide-react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { ProductBundle, Order, Review } from '../types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: 'live' | 'analytics' | 'orders' | 'products' | 'marketing' | 'content') => void;
  toggleAdminMode: () => void;
  navigate: (path: string) => void;
  ordersCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, toggleAdminMode, navigate, ordersCount }) => (
  <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 z-10">
    <div className="p-6 border-b border-gray-100">
      <h1 className="font-bold text-lg text-gray-900 flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-900 rounded-md"></div> AHN Admin
      </h1>
    </div>
    <nav className="flex-1 p-4 space-y-1">
      <button onClick={() => setActiveTab('live')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'live' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
        <LayoutDashboard size={18} /> Live View
      </button>
      <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
        <BarChart3 size={18} /> Analytics & Reports
      </button>
      <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
        <ShoppingBag size={18} /> Orders <span className="ml-auto bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">{ordersCount}</span>
      </button>
      <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
        <Package size={18} /> Products
      </button>
      <button onClick={() => setActiveTab('marketing')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'marketing' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
        <Globe size={18} /> Marketing & Pixels
      </button>
      <button onClick={() => setActiveTab('content')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'content' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
        <ImageIcon size={18} /> Site Content
      </button>
    </nav>
    <div className="p-4 border-t border-gray-100">
      <button onClick={toggleAdminMode} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
        Log Out
      </button>
      <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg">
        View Store
      </button>
    </div>
  </div>
);

const LiveView = () => {
  const { liveStats } = useShop();

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3"><Globe className="text-green-500" /> Live View</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Real-time
        </div>
      </div>

      <div className="h-64 bg-[#2a2a2a] rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden border border-gray-800">
        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center"></div>
        <div className="z-10 text-center">
          <div className="text-6xl font-bold mb-2 transition-all duration-500">{liveStats.activeVisitors}</div>
          <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">Visitors Right Now</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">Active Carts</p>
          <h3 className="text-3xl font-bold transition-all duration-500">{liveStats.activeCarts}</h3>
        </div>
        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">Checkouts Started</p>
          <h3 className="text-3xl font-bold transition-all duration-500">{liveStats.activeCheckouts}</h3>
        </div>
        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">Purchased (Session)</p>
          <h3 className="text-3xl font-bold transition-all duration-500">{liveStats.recentPurchases}</h3>
        </div>
        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">Total Sales (Today)</p>
          <h3 className="text-3xl font-bold text-green-400">Rs. {(liveStats.salesToday || 0).toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
};

const AnalyticsView = () => {
  const [range, setRange] = useState<'today' | 'yesterday' | '7d' | '30d'>('today');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getReport(range).then(setData).catch(console.error);
  }, [range]);

  if (!data) return <div className="p-8">Loading stats...</div>;

  const { chartData, summary } = data;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>

        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-sm cursor-pointer hover:bg-gray-50">
            <Calendar size={16} />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as any)}
              className="bg-transparent outline-none cursor-pointer appearance-none pr-6 z-10 font-medium"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-gray-500" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500">Total Sales</p>
            <ArrowUp size={16} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Rs. {summary.sales.toLocaleString()}</h3>
          <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">+12% vs previous period</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500">Online Store Sessions</p>
            <ArrowUp size={16} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{summary.visitors.toLocaleString()}</h3>
          <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">+5% vs previous period</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500">Total Orders</p>
            <ArrowDown size={16} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{summary.orders}</h3>
          <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">-2% vs previous period</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500">Conversion Rate</p>
            <ArrowUp size={16} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{summary.conversion}%</h3>
          <p className="text-xs text-gray-400 mt-2 font-medium">Industry Avg: 2.5%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Total Sales Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(value: any) => `Rs.${value / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                  formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Sessions by Hour/Day</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} hide />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-2">
          <h3 className="font-bold text-gray-900 mb-4">Detailed Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="p-3 font-medium">Time / Date</th>
                  <th className="p-3 font-medium">Sessions</th>
                  <th className="p-3 font-medium">Added to Cart</th>
                  <th className="p-3 font-medium">Orders</th>
                  <th className="p-3 font-medium">Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...chartData].reverse().slice(0, 8).map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-900 font-medium">{row.name}</td>
                    <td className="p-3 text-gray-600">{row.visitors}</td>
                    <td className="p-3 text-gray-600">{row.atc}</td>
                    <td className="p-3 text-gray-600">{row.orders}</td>
                    <td className="p-3 text-gray-900 font-bold">Rs. {row.sales.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersView = () => {
  const { updateOrderStatus, deleteOrder } = useShop(); // Don't use global 'orders'
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 50, pages: 1 });

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [dateRange, setDateRange] = useState<{ start: string | null, end: string | null, label: string }>({ start: null, end: null, label: 'All Time' });
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: meta.page,
        limit: meta.limit,
        search,
        status: status === 'All' ? undefined : status,
      };

      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const res = await api.getOrders(params);
      if (res.data) {
        setOrders(res.data);
        setMeta(res.meta);
      } else {
        // Fallback if API hasn't updated in hot reload yet
        setOrders(Array.isArray(res) ? res : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setMeta(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, status, dateRange]);

  // Pagination Change
  useEffect(() => {
    fetchOrders(); // Just fetch, dependency on meta.page handled by setter? No, fetch uses current state.
    // Actually simpler: add meta.page to dependency, but need to be careful of loops.
  }, [meta.page]);

  // Quick Date Helpers
  const setQuickDate = (type: 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'all') => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = new Date();
    let label = '';

    // Reset hours
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    switch (type) {
      case 'today':
        start = todayStart;
        end = todayEnd;
        label = 'Today';
        break;
      case 'yesterday':
        start = new Date(todayStart);
        start.setDate(start.getDate() - 1);
        end = new Date(todayEnd);
        end.setDate(end.getDate() - 1);
        label = 'Yesterday';
        break;
      case 'week':
        start = new Date(todayStart);
        start.setDate(start.getDate() - 7);
        end = todayEnd;
        label = 'Last 7 Days';
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = todayEnd;
        label = 'This Month';
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        end = todayEnd;
        label = 'This Year';
        break;
      case 'all':
        start = null;
        end = null;
        label = 'All Time';
        break;
    }

    setDateRange({
      start: start ? start.toISOString() : null,
      end: end ? end.toISOString() : null,
      label
    });
    setCustomStart('');
    setCustomEnd('');
  };

  // Handle Custom Date Apply
  const applyCustomDate = () => {
    if (customStart && customEnd) {
      setDateRange({
        start: new Date(customStart).toISOString(),
        end: new Date(new Date(customEnd).setHours(23, 59, 59, 999)).toISOString(),
        label: 'Custom'
      });
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure?')) {
      await deleteOrder(id);
      fetchOrders(); // Refresh list
      if (selectedOrder?.id === id) setSelectedOrder(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <div className="text-sm text-gray-500">
          Showing {orders.length} of {meta.total} orders
          {dateRange.label !== 'All Time' && <span className="ml-2 px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">{dateRange.label}</span>}
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 space-y-4">
        {/* Top Row: Search + Status */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, Name, Phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 w-full md:w-auto">
            <Filter size={16} />
            <select
              className="bg-transparent outline-none appearance-none pr-8 cursor-pointer w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>

        {/* Bottom Row: Date Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {[
              { l: 'All', v: 'all' },
              { l: 'Today', v: 'today' },
              { l: 'Yesterday', v: 'yesterday' },
              { l: '7 Days', v: 'week' },
              { l: 'This Month', v: 'month' },
              { l: 'This Year', v: 'year' },
            ].map((btn) => (
              <button
                key={btn.v}
                onClick={() => setQuickDate(btn.v as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${dateRange.label === (btn.l === '7 Days' ? 'Last 7 Days' : btn.l === 'All' ? 'All Time' : btn.l) // Simple match check
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {btn.l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <input
              type="date"
              className="bg-transparent text-xs border-none outline-none text-gray-600"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              className="bg-transparent text-xs border-none outline-none text-gray-600"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
            <button
              onClick={applyCustomDate}
              className="bg-white border border-gray-300 px-2 py-1 rounded shadow-sm text-xs font-bold hover:bg-gray-50"
            >
              Go
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="p-4 font-bold text-gray-900">{order.id}</td>
                    <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()} <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</span></td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.city} • {order.phone}</p>
                    </td>
                    <td className="p-4 font-medium">Rs. {order.total.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold inline-block ${order.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                          className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(order.id, e)}
                          className="p-1.5 hover:bg-red-100 rounded text-red-500"
                          title="Delete Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="p-12 text-center text-gray-500">No orders found matching your criteria.</div>}
          </>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={meta.page <= 1}
          onClick={() => setMeta(prev => ({ ...prev, page: prev.page - 1 }))}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600 font-medium">Page {meta.page} of {meta.pages}</span>
        <button
          disabled={meta.page >= meta.pages}
          onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order {selectedOrder.id}</h3>
                <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()} • {selectedOrder.items.length} Items</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-8">
              <div className="bg-gray-50 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order Status</p>
                  <select
                    value={selectedOrder.status}
                    onChange={async (e) => {
                      await updateOrderStatus(selectedOrder.id, e.target.value as any);
                      setSelectedOrder({ ...selectedOrder, status: e.target.value as any }); // Local update
                      fetchOrders(); // Refresh status in table
                    }}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Method</p>
                  <span className="font-bold text-gray-900 bg-white border border-gray-200 px-3 py-1 rounded text-sm inline-block">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Users size={16} /> Customer Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-bold text-gray-900 text-lg">{selectedOrder.customerName}</p>
                    <p className="flex items-center gap-2"><Phone size={14} /> {selectedOrder.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><MapPin size={16} /> Shipping Address</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="leading-relaxed">{selectedOrder.address || `${selectedOrder.city} (Full address not available)`}</p>
                    <p className="font-bold mt-2 text-gray-900">{selectedOrder.city}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={16} /> Order Items</h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                      <tr>
                        <th className="p-3 pl-4">Product</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right pr-4">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item: any, i: number) => (
                        <tr key={i}>
                          <td className="p-3 pl-4">
                            <div className="flex items-center gap-3">
                              <img src={item.image} className="w-10 h-10 rounded-lg object-cover bg-gray-100" alt="" />
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">Rs. {item.price.toLocaleString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center font-medium">{item.quantity}</td>
                          <td className="p-3 pr-4 text-right font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold text-gray-900">
                      <tr>
                        <td colSpan={2} className="p-3 pl-4 text-right">Grand Total</td>
                        <td className="p-3 pr-4 text-right text-lg">Rs. {selectedOrder.total.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-between items-center">
              <button
                onClick={(e) => {
                  handleDelete(selectedOrder.id, e);
                  setSelectedOrder(null);
                }}
                className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Trash2 size={16} /> Delete Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductsView = () => {
  const { products, addProduct, updateProduct } = useShop();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProductBundle | null>(null);
  const [uploading, setUploading] = useState(false);

  const startEditing = (product: ProductBundle) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveProduct = async () => {
    if (editingId && editForm) {
      updateProduct(editingId, editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleAddProduct = () => {
    const newProduct: ProductBundle = {
      id: `prod-${Date.now()}`,
      name: 'New Product',
      price: 0,
      originalPrice: 0,
      image: 'https://via.placeholder.com/800',
      images: ['https://via.placeholder.com/800'],
      description: 'Description here...',
      savings: 0,
      itemsCount: 1
    };
    addProduct(newProduct);
    startEditing(newProduct);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button onClick={handleAddProduct} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-black">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="grid gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {editingId === product.id && editForm ? (
              <div className="flex-1 grid gap-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="border border-gray-300 rounded p-2 text-sm font-bold w-full"
                  placeholder="Product Name"
                />
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign size={14} className="absolute top-3 left-2 text-gray-400" />
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                      className="border border-gray-300 rounded p-2 pl-6 text-sm w-full"
                      placeholder="Price"
                    />
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute top-2.5 left-2 text-gray-400 text-xs strike-through">Orig:</span>
                    <input
                      type="number"
                      value={editForm.originalPrice}
                      onChange={(e) => setEditForm({ ...editForm, originalPrice: parseInt(e.target.value) || 0 })}
                      className="border border-gray-300 rounded p-2 pl-10 text-sm w-full"
                      placeholder="Original Price"
                    />
                  </div>
                </div>

                {/* Image Gallery Edit */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 block">Product Images</label>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {/* Main Image Preview */}
                    <div className="relative group aspect-square rounded-lg overflow-hidden border-2 border-rose-500">
                      <img src={editForm.image} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-rose-500 text-white text-[10px] font-bold text-center py-0.5">Main</div>
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <span className="text-white text-xs font-bold flex flex-col items-center"><Upload size={14} /> Change</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              setUploading(true);
                              try {
                                const res = await api.uploadFile(e.target.files[0]);
                                setEditForm({ ...editForm, image: res.url });
                                setUploading(false);
                              } catch { setUploading(false); }
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Gallery Images */}
                    {(editForm.images || []).map((img, i) => (
                      <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img src={img} className="w-full h-full object-cover" />
                        {/* Actions Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              // Set as Main: Swap current main with this one, or just overwrite?
                              // Usually "Main" is just a reference. Let's make this image the main one.
                              setEditForm({ ...editForm, image: img });
                            }}
                            className="px-2 py-0.5 bg-white text-gray-900 text-[10px] font-bold rounded hover:bg-rose-500 hover:text-white"
                          >
                            Make Main
                          </button>
                          <button
                            onClick={() => {
                              const newImages = (editForm.images || []).filter((_, idx) => idx !== i);
                              setEditForm({ ...editForm, images: newImages });
                            }}
                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add New Button */}
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-900 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-gray-900">
                      {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div> : <Plus size={20} />}
                      <span className="text-[10px] font-bold mt-1">Add</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            setUploading(true);
                            try {
                              const res = await api.uploadFile(e.target.files[0]);
                              const current = editForm.images || [];
                              setEditForm({ ...editForm, images: [...current, res.url] });
                              setUploading(false);
                            } catch { setUploading(false); }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 mt-1">
                  <button onClick={saveProduct} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1"><Save size={12} /> Save</button>
                  <button onClick={cancelEditing} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-bold">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.itemsCount} Items in Bundle</p>
                  </div>
                  <button onClick={() => startEditing(product)} className="text-gray-400 hover:text-blue-600">
                    <Edit size={16} />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                  {product.images && product.images.length > 1 && (
                    <div className="flex pl-2">
                      {product.images.slice(0, 3).map((img, i) => (
                        <img key={i} src={img} className="w-6 h-6 rounded-full border border-white -ml-2 first:ml-0 bg-gray-100 object-cover" />
                      ))}
                      {product.images.length > 3 && <div className="w-6 h-6 rounded-full border border-white -ml-2 bg-gray-200 text-[10px] flex items-center justify-center font-bold">+{product.images.length - 3}</div>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MarketingView = () => {
  const { pixelConfig, updatePixelConfig } = useShop();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Marketing & Tracking</h2>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <div className="p-2 bg-blue-50 rounded-lg"><Globe size={20} /></div>
            <h3 className="font-bold text-gray-900 text-lg">Facebook / Meta</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pixel ID</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                placeholder="1234567890"
                value={pixelConfig.facebookPixelId}
                onChange={(e) => updatePixelConfig({ facebookPixelId: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conversion API Token</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg text-sm h-24 font-mono"
                placeholder="EAA..."
                value={pixelConfig.facebookCAPIToken}
                onChange={(e) => updatePixelConfig({ facebookCAPIToken: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-black">
            <div className="p-2 bg-gray-100 rounded-lg"><div className="w-5 h-5 bg-black rounded-full"></div></div>
            <h3 className="font-bold text-gray-900 text-lg">TikTok</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pixel ID</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                placeholder="C..."
                value={pixelConfig.tiktokPixelId}
                onChange={(e) => updatePixelConfig({ tiktokPixelId: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Events API Token</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg text-sm h-24 font-mono"
                placeholder="..."
                value={pixelConfig.tiktokCAPIToken}
                onChange={(e) => updatePixelConfig({ tiktokCAPIToken: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentView = () => {
  const { media, addMedia, deleteMedia, reviews, createReview, deleteReview, pixelConfig, updatePixelConfig } = useShop();
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<'media' | 'reviews' | 'images'>('media');

  // Media Upload
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const file = e.target.files[0];
        const res = await api.uploadFile(file);
        await addMedia({
          type: file.type.startsWith('video') ? 'video' : 'image',
          src: res.url,
          user: 'Admin Upload'
        });
        setUploading(false);
      } catch { setUploading(false); alert('Fail'); }
    }
  };

  // Before/After Upload
  const handleBeforeAfterUpload = async (type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const file = e.target.files[0];
        const res = await api.uploadFile(file);
        if (type === 'before') updatePixelConfig({ beforeImage: res.url });
        else updatePixelConfig({ afterImage: res.url });
        setUploading(false);
      } catch { setUploading(false); alert('Fail'); }
    }
  }

  // New Review State
  const [newReview, setNewReview] = useState({ user: '', rating: 5, comment: '' });

  const handleAddReview = () => {
    createReview(newReview);
    setNewReview({ user: '', rating: 5, comment: '' });
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Site Content</h2>
        <div className="flex bg-white p-1 rounded-lg border border-gray-200">
          <button onClick={() => setTab('images')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${tab === 'images' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Before / After</button>
          <button onClick={() => setTab('reviews')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${tab === 'reviews' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Reviews</button>
          <button onClick={() => setTab('media')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${tab === 'media' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Scrolling Gallery</button>
        </div>
      </div>

      {/* IMAGES TAB */}
      {tab === 'images' && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Before Image</h3>
              <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative group mb-4">
                {pixelConfig.beforeImage ? <img src={pixelConfig.beforeImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <span className="text-white font-bold flex items-center gap-2"><Upload size={16} /> Change</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBeforeAfterUpload('before', e)} />
                </label>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">After Image</h3>
              <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative group mb-4">
                {pixelConfig.afterImage ? <img src={pixelConfig.afterImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <span className="text-white font-bold flex items-center gap-2"><Upload size={16} /> Change</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBeforeAfterUpload('after', e)} />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Real Glow, Real People (Product Page)</h3>
            <p className="text-sm text-gray-500 mb-4">Upload multiple images for the horizontal scroll on Product Page.</p>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-4">
              {(pixelConfig.realGlowImages || []).map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={img} className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      const newImages = (pixelConfig.realGlowImages || []).filter((_, idx) => idx !== i);
                      updatePixelConfig({ realGlowImages: newImages });
                    }}
                    className="absolute top-1 right-1 p-1 bg-white text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-900 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-gray-900">
                <Plus size={24} />
                <span className="text-xs font-bold mt-1">Add</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      setUploading(true);
                      try {
                        const res = await api.uploadFile(e.target.files[0]);
                        const current = pixelConfig.realGlowImages || [];
                        updatePixelConfig({ realGlowImages: [...current, res.url] });
                        setUploading(false);
                      } catch { setUploading(false); }
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Ingredients Section Image</h3>
              <p className="text-xs text-gray-500 mb-4">Image next to: "Finally a cream that doesn't burn my skin..."</p>
              <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative group">
                {pixelConfig.safePromiseImage ? <img src={pixelConfig.safePromiseImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <span className="text-white font-bold flex items-center gap-2"><Upload size={16} /> Change</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        setUploading(true);
                        try {
                          const res = await api.uploadFile(e.target.files[0]);
                          updatePixelConfig({ safePromiseImage: res.url });
                          setUploading(false);
                        } catch { setUploading(false); }
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Ingredients/Formula Image (Home)</h3>
              <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative group">
                {pixelConfig.ingredientsImage ? <img src={pixelConfig.ingredientsImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <span className="text-white font-bold flex items-center gap-2"><Upload size={16} /> Change</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        setUploading(true);
                        try {
                          const res = await api.uploadFile(e.target.files[0]);
                          updatePixelConfig({ ingredientsImage: res.url });
                          setUploading(false);
                        } catch { setUploading(false); }
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {tab === 'reviews' && (
        <div className="grid gap-6">
          {/* Add New */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Add Testimonial</h3>
            <div className="flex gap-4">
              <input className="border border-gray-300 rounded-lg p-2 text-sm" placeholder="User Name" value={newReview.user} onChange={(e) => setNewReview({ ...newReview, user: e.target.value })} />
              <select className="border border-gray-300 rounded-lg p-2 text-sm" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
              <input className="border border-gray-300 rounded-lg p-2 text-sm flex-1" placeholder="Comment..." value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} />
              <button onClick={handleAddReview} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Add</button>
            </div>
          </div>

          {/* List */}
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold">{r.user.charAt(0)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{r.user}</p>
                      <div className="flex text-amber-400 text-xs">
                        {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                    </div>
                    <button onClick={() => deleteReview(r.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                  <p className="text-gray-600 text-sm mt-2 italic">"{r.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEDIA TAB (Existing) */}
      {tab === 'media' && (
        <div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
            <h3 className="font-bold text-gray-900 mb-2 block">Add to Scrolling Gallery</h3>
            <p className="text-sm text-gray-500 mb-4">Upload videos (MP4) or images (JPG, PNG) to appear in the "Real Results" slider on Home page.</p>
            <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold cursor-pointer transition-colors ${uploading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-black'}`}>
              {uploading ? 'Uploading...' : <><Upload size={18} /> Select File</>}
              <input type="file" className="hidden" onChange={handleMediaUpload} disabled={uploading} />
            </label>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {media.map((m) => (
              <div key={m.id} className="relative group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 aspect-square">
                {m.type === 'video' ? (
                  <video src={m.src} className="w-full h-full object-cover" controls />
                ) : (
                  <img src={m.src} alt="" className="w-full h-full object-cover" />
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => deleteMedia(m.id)} className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export const Admin: React.FC = () => {
  const { isAdminMode, toggleAdminMode, orders } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'live' | 'analytics' | 'orders' | 'products' | 'marketing' | 'content'>('live');

  // Auth Screen
  if (!isAdminMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Admin Portal</h2>
          <p className="text-sm text-gray-500 mb-8">Restricted access area. Please verify your credentials to continue.</p>
          <button onClick={toggleAdminMode} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-xl mb-4">
            Enter Dashboard
          </button>
          <button onClick={() => navigate('/')} className="text-xs text-gray-400 hover:text-gray-600">Return to Store</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleAdminMode={toggleAdminMode}
        navigate={navigate}
        ordersCount={orders.length}
      />
      <div className="flex-1 ml-64">
        {activeTab === 'live' && <LiveView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'products' && <ProductsView />}
        {activeTab === 'marketing' && <MarketingView />}
        {activeTab === 'content' && <ContentView />}
      </div>
    </div>
  );
};