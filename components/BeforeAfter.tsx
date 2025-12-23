import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ beforeImage, afterImage }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const newPos = (x / rect.width) * 100;
      setPosition(Math.min(100, Math.max(0, newPos)));
    }
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  }, [handleMove]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging.current) handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, [onMouseMove, onTouchMove, onMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg mx-auto aspect-[4/5] rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-2xl group border-4 border-white touch-none"
      onMouseDown={(e) => { isDragging.current = true; handleMove(e.clientX); }}
      onTouchStart={(e) => { isDragging.current = true; handleMove(e.touches[0].clientX); }}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="After Result"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-widest z-10 border border-white/20">
        AFTER
      </div>

      {/* Before Image (Foreground - Clipped) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt="Before Result"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-widest z-10 shadow-sm">
          BEFORE
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-rose-500 transition-transform hover:scale-110 border-2 border-rose-100">
          <div className="flex gap-0.5">
            <ChevronLeft size={16} strokeWidth={3} />
            <ChevronRight size={16} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Interactive Overlay Hint */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${isDragging.current ? 'opacity-0' : 'opacity-0 md:group-hover:opacity-100'}`}>
        <div className="bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium">
          Drag to compare
        </div>
      </div>
    </div>
  );
};