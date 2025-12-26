import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

declare global {
    interface Window {
        fbq: any;
        ttq: any;
    }
}

export const PixelTracker: React.FC = () => {
    const { pixelConfig } = useShop();
    const location = useLocation();
    const [fbLoaded, setFbLoaded] = React.useState(false);
    const [ttLoaded, setTtLoaded] = React.useState(false);

    // Initialize Pixels
    useEffect(() => {
        // Facebook Pixel Init
        if (pixelConfig.facebookPixelId && !fbLoaded) {
            if (window.fbq) {
                window.fbq('init', pixelConfig.facebookPixelId);
                window.fbq('track', 'PageView');
                setFbLoaded(true);
            }
        }

        // TikTok Pixel Init
        if (pixelConfig.tiktokPixelId && !ttLoaded) {
            if (window.ttq) {
                // Load Pixel from Config
                window.ttq.load(pixelConfig.tiktokPixelId);
                window.ttq.page();
                setTtLoaded(true);
            }
        }
    }, [pixelConfig.facebookPixelId, pixelConfig.tiktokPixelId, fbLoaded, ttLoaded]);

    // Track Page Views on Route Change
    // Better approach:
    // Remove 'track PageView' from Init. Let Route Change handle ALL of them, including first?
    // Problem: Init might happen 1 second later. Route Change effect ran at 0s.
    // If we guard Route Change with `if (!loaded) return`, then the first page view is LOST.
    // So Init MUST fire the first one.

    // So:
    // Init Effect: Load Lib -> Fire PageView (Catch-up for the first view).
    // Route Effect: If loaded -> Fire PageView.
    // Issue: How to prevent Init-PageView and Route-PageView from BOTH running for the first view?
    // Solution: The Route Effect runs on mount. If `!loaded`, it skips.
    // Then Init Effect runs. Loads. Fires PageView.
    // Result: 1 PageView. Correct.

    // Scenario 2: Navigate to new page.
    // Route Effect runs. `loaded` is true. Fires PageView.
    // Result: 1 PageView. Correct.

    // Scenario 3: Config updates? (Rare) -> Init runs -> Fires PageView. Duplicate?
    // `loaded` state prevents re-init.

    // So the logic is: Guard Route Effect with `loaded`.

    // Implementation:
    const prevPathRef = React.useRef(location.pathname);

    useEffect(() => {
        // If path changed, track
        if (location.pathname !== prevPathRef.current) {
            prevPathRef.current = location.pathname;
            if (fbLoaded && window.fbq) window.fbq('track', 'PageView');
            if (ttLoaded && window.ttq) window.ttq.page();
        }
    }, [location.pathname, fbLoaded, ttLoaded]);

    return null;
};
