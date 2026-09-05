import { publicApi } from './api.js';

let isInitialized = false;
let currentSettings = null;

/**
 * Initialize Meta Pixel, TikTok Pixel, and Google Analytics dynamically
 */
export async function initTracking() {
  if (typeof window === 'undefined' || isInitialized) return;

  try {
    const res = await publicApi.get('/tracking/settings');
    const settings = res.data?.settings || {};
    currentSettings = settings;

    // 1. Meta Pixel
    if (settings.meta_pixel_id) {
      injectMetaPixel(settings.meta_pixel_id);
    }

    // 2. TikTok Pixel
    if (settings.tiktok_pixel_id) {
      injectTikTokPixel(settings.tiktok_pixel_id);
    }

    // 3. Google Analytics 4
    if (settings.google_analytics_id) {
      injectGoogleAnalytics(settings.google_analytics_id);
    }

    isInitialized = true;
  } catch (err) {
    console.warn('Tracking initialization notice:', err.message);
  }
}

function injectMetaPixel(pixelId) {
  if (window.fbq) return;
  /* eslint-disable */
  (function(f,b,e,v,n,t,s){
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
}

function injectTikTokPixel(pixelId) {
  if (window.ttq) return;
  /* eslint-disable */
  (function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
    var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
    ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  })(window, document, 'ttq');
  /* eslint-enable */
  window.ttq.load(pixelId);
  window.ttq.page();
}

function injectGoogleAnalytics(measurementId) {
  if (window.gtag) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
}

/**
 * View Content Event
 */
export function trackViewContent(product) {
  if (!product) return;
  const price = Number(product.price || 0);

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: price,
      currency: 'EGP',
    });
  }

  // TikTok Pixel
  if (window.ttq) {
    window.ttq.track('ViewContent', {
      content_id: product.id,
      content_type: 'product',
      content_name: product.name,
      value: price,
      currency: 'EGP',
    });
  }

  // GA4
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'EGP',
      value: price,
      items: [{ item_id: product.id, item_name: product.name, price }]
    });
  }
}

/**
 * Add to Cart Event
 */
export function trackAddToCart(product, qty = 1, variant = null) {
  if (!product) return;
  const price = variant ? Number(variant.price) : Number(product.price || 0);
  const totalValue = price * qty;

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: totalValue,
      currency: 'EGP',
    });
  }

  // TikTok Pixel
  if (window.ttq) {
    window.ttq.track('AddToCart', {
      content_id: product.id,
      content_name: product.name,
      value: totalValue,
      currency: 'EGP',
    });
  }

  // GA4
  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'EGP',
      value: totalValue,
      items: [{ item_id: product.id, item_name: product.name, quantity: qty, price }]
    });
  }
}

/**
 * Initiate Checkout Event
 */
export function trackInitiateCheckout(items = [], total = 0) {
  const numItems = items.reduce((s, it) => s + (it.qty || 1), 0);

  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      num_items: numItems,
      value: total,
      currency: 'EGP',
    });
  }

  if (window.ttq) {
    window.ttq.track('InitiateCheckout', {
      value: total,
      currency: 'EGP',
    });
  }

  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'EGP',
      value: total,
      items: items.map(it => ({ item_id: it.id, item_name: it.name, quantity: it.qty, price: it.price }))
    });
  }
}

/**
 * Purchase Event (Dual Client + Server CAPI Deduplication)
 */
export async function trackPurchase(order, items = [], customerInfo = {}) {
  if (!order?.id) return;
  const eventId = `purchase_${order.id}_${Date.now()}`;
  const total = Number(order.total_amount || 0);

  // 1. Meta Pixel (Browser)
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: total,
      currency: 'EGP',
      content_type: 'product',
      order_id: String(order.id),
    }, { eventID: eventId });
  }

  // 2. TikTok Pixel (Browser)
  if (window.ttq) {
    window.ttq.track('CompletePayment', {
      content_id: String(order.id),
      value: total,
      currency: 'EGP',
    });
  }

  // 3. Google Analytics 4 (Browser)
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: String(order.id),
      value: total,
      currency: 'EGP',
      shipping: Number(order.shipping_cost || 0),
      items: items.map(it => ({ item_id: it.id, item_name: it.name, quantity: it.qty, price: it.price }))
    });
  }

  // 4. Meta Conversion API (CAPI Server-to-Server with Deduplication eventID)
  try {
    await publicApi.post('/tracking/meta-capi', {
      event_name: 'Purchase',
      event_id: eventId,
      event_time: Math.floor(Date.now() / 1000),
      user_data: {
        ph: customerInfo.whatsapp ? [hashSimple(customerInfo.whatsapp)] : undefined,
        fn: customerInfo.name ? [hashSimple(customerInfo.name)] : undefined,
      },
      custom_data: {
        currency: 'EGP',
        value: total,
        order_id: String(order.id),
      },
      event_source_url: window.location.href,
    });
  } catch (e) {
    // Non-blocking
  }
}

function hashSimple(str) {
  // In real CAPI, sha256 is recommended, but backend/client can pass trimmed phone
  return String(str).trim().toLowerCase();
}
