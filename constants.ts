import { ProductBundle, Review, SalesData } from './types';

// Using placeholders that mimic the pink/gold aesthetic
export const PRODUCT_IMAGE_MAIN = "https://i.postimg.cc/7L9Bqvpw/a3fd3232_52de_4ab3_a56b_29eab2aa9065.png";
export const PRODUCT_IMAGE_OPEN = "https://i.postimg.cc/vmhPGRpM/b941fd23_363b_4178_b2d9_54f5c50964a4.png";

// Marketing Assets for Before/After
// UPDATED: Set to distinct portrait images to match the user's provided style (Acne -> Clear)
// REPLACE these URLs with your hosted image links for the specific "Before" and "After" photos provided.
export const BEFORE_IMAGE = "https://i.postimg.cc/QxMjDswf/798016ac_4a1d_4d79_aafe_5bb710ab4314.png"; 
export const AFTER_IMAGE = "https://i.postimg.cc/Nf0QtYSp/fb30fc6f_9729_459a_9058_3d225c584231.png";

export const BUNDLES: ProductBundle[] = [
  {
    id: 'starter',
    name: 'The Starter Kit',
    price: 1950,
    originalPrice: 2800,
    image: PRODUCT_IMAGE_MAIN,
    description: '1x AHN White+ Cream (50ml). Ideal for testing the formula.',
    savings: 850,
    itemsCount: 1
  },
  {
    id: 'glow-up',
    name: 'The Glow Up Set',
    price: 2850,
    originalPrice: 5600,
    image: PRODUCT_IMAGE_OPEN,
    description: '2x Jars + Free Priority Delivery. Recommended for full 6-week course.',
    badge: 'DERMATOLOGIST CHOICE',
    savings: 2750,
    itemsCount: 2
  },
  {
    id: 'ultimate',
    name: 'Full Radiance Course',
    price: 3750,
    originalPrice: 8400,
    image: PRODUCT_IMAGE_MAIN,
    description: '3x Jars. The complete regimen for stubborn pigmentation.',
    badge: 'BEST VALUE',
    savings: 4650,
    itemsCount: 3
  }
];

export const REVIEWS: Review[] = [
  { 
    id: 1, 
    user: "Sana Ahmed", 
    rating: 5, 
    comment: "I was scared of using whitening creams because of steroids, but this ingredients list is safe. Niacinamide really helped my oily T-zone in Karachi heat."
  },
  { 
    id: 2, 
    user: "Fatima Sheikh", 
    rating: 5, 
    comment: "No itching, no redness! Finally a cream that doesn't burn my sensitive skin. My acne marks are fading slowly but surely."
  },
  { 
    id: 3, 
    user: "Zainab Ali", 
    rating: 4, 
    comment: "Packaging is sealed properly, batch code was verified. 100% original. Result takes time, don't expect magic in 2 days."
  },
  { 
    id: 4, 
    user: "Hina Parveen", 
    rating: 5, 
    comment: "Best thing is it's not greasy. Unlike those sticky formula creams, this absorbs like water. Good for humidity."
  },
  { 
    id: 5, 
    user: "Mariam Khan", 
    rating: 5, 
    comment: "My melasma patches (chhaiyan) are much lighter after 3 weeks. Stick to it and use sunscreen!"
  },
  { 
    id: 6, 
    user: "Dr. Nida (DPT)", 
    rating: 5, 
    comment: "Checked the ingredients. No mercury or hydroquinone found. Safe for daily use. Highly recommended for maintenance."
  },
  { 
    id: 7, 
    user: "Komal Jamshed", 
    rating: 4, 
    comment: "Delivered to Multan in 3 days. Texture is milky white. Smells nice, not too strong."
  },
  { 
    id: 8, 
    user: "Rabia Siddiqui", 
    rating: 5, 
    comment: "Used a lot of 'mix creams' and destroyed my skin barrier. This cream is repairing it. My skin feels soft again."
  },
  { 
    id: 9, 
    user: "Saba Qureshi", 
    rating: 5, 
    comment: "Original product. The holographic seal was intact. Trustworthy seller."
  },
  { 
    id: 10, 
    user: "Maira Khan", 
    rating: 4, 
    comment: "Good for dark knuckles and elbows too. Not just face."
  },
  { 
    id: 11, 
    user: "Mahnoor Bilal", 
    rating: 5, 
    comment: "Alpha Arbutin is a game changer. My sun tan from college commute is finally going away."
  },
  { 
    id: 12, 
    user: "Sidra Karim", 
    rating: 3, 
    comment: "Result is slow. 2 weeks hogaye halka sa farq para hai. But at least no side effects."
  },
  { 
    id: 13, 
    user: "Hamza Ali", 
    rating: 5, 
    comment: "Men can use this too. Removed my bike-riding tan lines on forehead."
  },
  { 
    id: 14, 
    user: "Anila Raza", 
    rating: 5, 
    comment: "Face grey nahi lagta ab. Glow is natural, not that fake white ghostly look."
  },
  { 
    id: 15, 
    user: "Zara Ahmed", 
    rating: 4, 
    comment: "Little expensive but worth it for safety. Cheap creams ruin skin."
  }
];

export const SALES_DATA: SalesData[] = [
  { name: 'Mon', sales: 40000, visitors: 2400 },
  { name: 'Tue', sales: 30000, visitors: 1398 },
  { name: 'Wed', sales: 20000, visitors: 9800 },
  { name: 'Thu', sales: 27800, visitors: 3908 },
  { name: 'Fri', sales: 18900, visitors: 4800 },
  { name: 'Sat', sales: 23900, visitors: 3800 },
  { name: 'Sun', sales: 34900, visitors: 4300 },
];

export const POPUP_NAMES = ["Hina from Lahore", "Sana from Karachi", "Mariam from Islamabad", "Anum from Rawalpindi", "Zara from Faisalabad", "Sadia from Multan"];

export const UGC_MEDIA = [
  { type: 'video', src: "https://images.unsplash.com/photo-1616763355603-9755a640a287?auto=format&fit=crop&q=80&w=400", user: "Hira's Routine" },
  { type: 'image', src: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=400", user: "Before/After" },
  { type: 'video', src: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=400", user: "Unboxing" },
  { type: 'image', src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400", user: "Texture" },
];