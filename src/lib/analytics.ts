/**
 * Lightweight, privacy-friendly analytics event tracker.
 *
 * No third-party script is loaded unless NEXT_PUBLIC_GA_ID is configured.
 * Events are pushed to window.dataLayer when GA is present, and always
 * logged in dev so integration can be verified.
 */

export type AnalyticsEvent =
  | 'project_cta_clicked'
  | 'whatsapp_clicked'
  | 'contact_form_submitted'
  | 'quote_calculator_used'
  | 'pricing_cta_clicked'
  | 'project_viewed'
  | 'service_cta_clicked'
  | 'request_website_submitted';

export function track(event: AnalyticsEvent, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...params });
    }
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', event, params ?? {});
    }
  } catch {
    // analytics must never break the page
  }
}
