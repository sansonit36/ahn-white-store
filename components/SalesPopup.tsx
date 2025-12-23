import React, { useState, useEffect } from 'react';
import { POPUP_NAMES, BUNDLES } from '../constants';
import { CheckCircle2 } from 'lucide-react';

export const SalesPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: '', product: '' });

  useEffect(() => {
    const showPopup = () => {
      const randomName = POPUP_NAMES[Math.floor(Math.random() * POPUP_NAMES.length)];
      const randomBundle = BUNDLES[Math.floor(Math.random() * BUNDLES.length)].name;
      setData({ name: randomName, product: randomBundle });
      setVisible(true);

      setTimeout(() => setVisible(false), 5000);
    };

    const interval = setInterval(() => {
      // Random delay between 10s and 25s
      const delay = Math.random() * 15000 + 10000;
      setTimeout(showPopup, delay);
    }, 20000);

    // Initial show
    setTimeout(showPopup, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-xl border-l-4 border-green-500 flex items-center gap-3 animate-slide-up max-w-xs">
      <div className="bg-green-100 p-2 rounded-full text-green-600">
        <CheckCircle2 size={20} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-900">{data.name}</p>
        <p className="text-xs text-gray-600">purchased <span className="font-semibold text-rose-500">{data.product}</span></p>
        <p className="text-[10px] text-gray-400 mt-1">Just now</p>
      </div>
    </div>
  );
};