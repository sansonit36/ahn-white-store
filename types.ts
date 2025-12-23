export interface ProductBundle {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  images?: string[]; // Gallery
  description: string;
  badge?: string;
  savings: number;
  itemsCount: number;
}

export interface CartItem extends ProductBundle {
  quantity: number;
}

export interface SalesData {
  name: string;
  sales: number;
  visitors: number;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: CartItem[];
  total: number;
  date: string;
  status: OrderStatus;
  paymentMethod: 'COD';
  createdAt: string;
}

export interface PixelConfig {
  facebookPixelId: string;
  facebookCAPIToken: string;
  tiktokPixelId: string;
  tiktokCAPIToken: string;
  beforeImage?: string;
  afterImage?: string;
  realGlowImages?: string[];
  safePromiseImage?: string;
  ingredientsImage?: string;
}

export interface LiveStats {
  activeVisitors: number;
  activeCarts: number;
  activeCheckouts: number;
  recentPurchases: number;
  salesToday: number;
}

export interface Media {
  id: string;
  type: 'video' | 'image';
  src: string;
  user?: string;
}