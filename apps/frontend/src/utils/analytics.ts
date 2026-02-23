// Google Analytics 4 integration

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

// Initialize GA
export function initGA() {
  if (!GA_TRACKING_ID) {
    console.log('GA tracking ID not configured');
    return;
  }

  // Load GA script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID);

  (window as any).gtag = gtag;
}

// Track page view
export function trackPageView(url: string) {
  if (!GA_TRACKING_ID || !(window as any).gtag) return;

  (window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
}

// Track event
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (!GA_TRACKING_ID || !(window as any).gtag) return;

  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

// Track CV download
export function trackCVDownload() {
  trackEvent('download', 'CV', 'cv_download');
  console.log('CV download tracked');
}

// Declare global types
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
