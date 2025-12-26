import React, { useRef } from 'react';
import { Play } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const DEFAULT_VIDEOS = [
  { id: '1', title: "Morning Routine", thumbnail: "https://images.unsplash.com/photo-1556942154-007c9798cd92?auto=format&fit=crop&q=80&w=400", type: 'image' },
  { id: '2', title: "Texture Shot", thumbnail: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400", type: 'image' },
  { id: '3', title: "Customer Review", thumbnail: "https://images.unsplash.com/photo-1546942153-e59b86347007?auto=format&fit=crop&q=80&w=400", type: 'image' },
  { id: '4', title: "Unboxing AHN", thumbnail: "https://images.unsplash.com/photo-1554196346-b717b9642927?auto=format&fit=crop&q=80&w=400", type: 'image' },
];

export const VerticalVideos: React.FC = () => {
  const { media } = useShop();

  // Filter for videos AND images from uploaded media
  // The 'Scrolling Gallery' in Admin uploads to the 'media' state.
  // We want to show everything from there.
  const dynamicItems = media.filter(m => m.type === 'video' || m.type === 'image');

  // Use dynamic items if available, otherwise fallback
  const displayItems = dynamicItems.length > 0 ? dynamicItems : DEFAULT_VIDEOS;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl font-serif font-bold text-center text-gray-900">Real Results, Real People</h2>
        <p className="text-center text-gray-500 mt-2">Join thousands of glowing customers on TikTok & Instagram</p>
      </div>

      <div className="flex overflow-x-auto gap-6 px-8 pb-8 snap-x scrollbar-hide">
        {displayItems.map((item) => (
          <div key={item.id} className="snap-center shrink-0 w-[280px] h-[500px] relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl bg-black">
            {/* If it's a real 'video' type from dynamic media, render video tag */}
            {item.type === 'video' ? (
              <video
                src={(item as any).src}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => {
                  // Hack to show "3rd frame" (approx 0.1s - 0.5s) instead of black start
                  e.currentTarget.currentTime = 0.5;
                }}
                onMouseEnter={(e) => {
                  // Reset to start if we are just previewing the thumbnail frame
                  if (e.currentTarget.currentTime === 0.5) e.currentTarget.currentTime = 0;
                  e.currentTarget.play();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  // Optional: Reset to thumbnail frame?
                  // e.currentTarget.currentTime = 0.5; 
                }}
                poster={(item as any).thumbnail || ""} // Optional poster if we had one
              />
            ) : (
              // Fallback for default images
              <img src={(item as any).thumbnail} alt={item.title || "Video"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            )}

            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Play fill="currentColor" size={24} />
              </div>
            </div>
            {(item as any).title && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <p className="text-white font-medium">{(item as any).title}</p>
              </div>
            )}
            {(item as any).user && (item as any).user !== 'Admin Upload' && (
              <div className="absolute top-4 left-4 pointer-events-none">
                <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">{(item as any).user}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};