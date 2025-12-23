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

    // Initialize Pixels
    useEffect(() => {
        // Facebook Pixel Init
        if (pixelConfig.facebookPixelId && !window.fbq) {
            // @ts-ignore
            !function (f, b, e, v, n, t, s) {
                if (f.fbq) return; n = f.fbq = function () {
                    // @ts-ignore
                    n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                // @ts-ignore
                if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
                n.queue = []; t = b.createElement(e); t.async = !0;
                t.src = v; s = b.getElementsByTagName(e)[0];
                // @ts-ignore
                s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
                'https://connect.facebook.net/en_US/fbevents.js');

            window.fbq('init', pixelConfig.facebookPixelId);
            window.fbq('track', 'PageView'); // Track initial page view immediately after init
        }

        // TikTok Pixel Init
        if (pixelConfig.tiktokPixelId && !window.ttq) {
            // @ts-ignore
            !function (w, d, t) {
                w.ttq = w.ttq || [];
                w.ttq.methods = [
                    "page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"
                ];
                w.ttq.setAndDefer = function (t: any, e: any) {
                    t[e] = function () {
                        t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
                    }
                };
                for (var i = 0; i < w.ttq.methods.length; i++) w.ttq.setAndDefer(w.ttq, w.ttq.methods[i]);
                w.ttq.instance = function (t: any) {
                    for (var e = w.ttq.methods[i = 0]; i < w.ttq.methods.length; i++) w.ttq.setAndDefer(t, w.ttq.methods[i]);
                    return t
                };
                w.ttq.load = function (e: any, n: any) {
                    var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
                    w.ttq._i = w.ttq._i || {}, w.ttq._i[e] = [], w.ttq._i[e]._u = i, w.ttq._t = w.ttq._t || {}, w.ttq._t[e] = +new Date, w.ttq._o = w.ttq._o || {}, w.ttq._o[e] = n || {};
                    var o = document.createElement("script");
                    o.type = "text/javascript", o.async = !0, o.src = i + "?sdkid=" + e + "&lib=" + t;
                    var a = document.getElementsByTagName("script")[0];
                    a.parentNode?.insertBefore(o, a)
                };
                w.ttq.load(pixelConfig.tiktokPixelId);
                w.ttq.page();
            }(window, document, 'ttq');
        }
    }, [pixelConfig.facebookPixelId, pixelConfig.tiktokPixelId]);

    // Track Page Views on Route Change
    useEffect(() => {
        if (window.fbq) window.fbq('track', 'PageView');
        if (window.ttq) window.ttq.page();
    }, [location.pathname]);

    return null;
};
