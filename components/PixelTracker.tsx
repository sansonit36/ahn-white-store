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
        // Use Config ID or Fallback to Hardcoded ID
        const tikTokId = pixelConfig.tiktokPixelId || 'D56K0O3C77U84I7BNNDG';

        if (tikTokId && !ttLoaded) {
            // Inject Base Code if missing
            if (!window.ttq) {
                (function (w: any, d, t) {
                    w.TiktokAnalyticsObject = t;
                    var ttq = w[t] = w[t] || [];
                    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
                    ttq.setAndDefer = function (t: any, e: any) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } };
                    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
                    ttq.instance = function (t: any) {
                        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
                        return e
                    };
                    ttq.load = function (e: any, n: any) {
                        var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
                        ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = r, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
                        var n: any = document.createElement("script");
                        n.type = "text/javascript", n.async = !0, n.src = r + "?sdkid=" + e + "&lib=" + t;
                        var e: any = document.getElementsByTagName("script")[0];
                        e.parentNode.insertBefore(n, e)
                    };
                })(window, document, 'ttq');
            }

            if (window.ttq) {
                window.ttq.load(tikTokId);
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
