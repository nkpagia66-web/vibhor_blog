/**
 * Quote / Website-requirement calculator rules — single source of truth for
 * every pricing rule used by the estimator. Change a number here and the
 * homepage calculator, /request-website tool and WhatsApp quote messages all
 * update together.
 *
 * IMPORTANT: results are estimates, never binding quotations. The UI always
 * shows the disclaimer from `calculatorConfig.disclaimer`.
 */

export type WebsiteType = {
  id: string;
  label: string;
  basePrice: number;
  description: string;
};

export type FeatureOption = {
  id: string;
  label: string;
  price: number;
  /** some features are included at no extra cost */
  free?: boolean;
};

export type SupportOption = {
  id: string;
  label: string;
  monthlyPrice: number; // 0 = no monthly cost
  description: string;
};

export const calculatorConfig = {
  websiteTypes: [
    { id: 'landing', label: 'Landing Page', basePrice: 9999, description: 'A single focused page designed to convert.' },
    { id: 'business', label: 'Business Website', basePrice: 14999, description: 'Multi-page site for a company or service business.' },
    { id: 'portfolio', label: 'Portfolio', basePrice: 12999, description: 'Showcase site for professionals and creatives.' },
    { id: 'ecommerce', label: 'E-commerce', basePrice: 34999, description: 'Online store with products, cart and checkout.' },
    { id: 'blog', label: 'Blog', basePrice: 12999, description: 'Content-focused site with articles and categories.' },
    { id: 'booking', label: 'Booking Website', basePrice: 24999, description: 'Appointments, reservations or scheduling flows.' },
    { id: 'custom', label: 'Custom Web Application', basePrice: 49999, description: 'Bespoke app built around your workflow.' },
  ] satisfies WebsiteType[],

  pages: {
    included: 5, // pages included in base price
    pricePerPage: 999, // charged for pages beyond `included`
    min: 1,
    max: 50,
    default: 5,
  },

  features: [
    { id: 'contact-form', label: 'Contact form', price: 0, free: true },
    { id: 'whatsapp', label: 'WhatsApp integration', price: 0, free: true },
    { id: 'seo', label: 'SEO setup', price: 0, free: true },
    { id: 'analytics', label: 'Analytics', price: 1500 },
    { id: 'blog', label: 'Blog', price: 4000 },
    { id: 'admin-panel', label: 'Admin panel', price: 8000 },
    { id: 'user-login', label: 'User login', price: 6000 },
    { id: 'search', label: 'Search', price: 3000 },
    { id: 'product-management', label: 'Product management', price: 8000 },
    { id: 'payment-gateway', label: 'Payment gateway', price: 6000 },
    { id: 'booking', label: 'Booking', price: 7000 },
    { id: 'api-integration', label: 'API integration', price: 6000 },
    { id: 'ai-chatbot', label: 'AI chatbot', price: 10000 },
    { id: 'multi-language', label: 'Multi-language', price: 8000 },
  ] satisfies FeatureOption[],

  support: [
    { id: 'none', label: 'No monthly support', monthlyPrice: 0, description: 'One-time project only.' },
    { id: 'monthly', label: 'Monthly support', monthlyPrice: 1499, description: 'Care & hosting plan: hosting, maintenance, minor updates and support.' },
    { id: 'premium', label: 'Premium support', monthlyPrice: 3999, description: 'Higher-touch maintenance with faster response for active businesses.' },
  ] satisfies SupportOption[],

  /** Typical delivery windows shown as guidance only — not a guarantee. */
  timelines: [
    { maxPages: 5, label: '1–2 weeks' },
    { maxPages: 12, label: '2–4 weeks' },
    { maxPages: 99, label: '4–8 weeks' },
  ],

  disclaimer:
    'This is an estimated project price, not a legally binding quotation. Final price depends on requirements, scope and complexity after we discuss your project.',
} as const;

export type CalculatorInput = {
  websiteType: string;
  pages: number;
  features: string[];
  support: string;
};

export type CalculatorResult = {
  basePrice: number;
  pagesPrice: number;
  featuresPrice: number;
  oneTimeTotal: number;
  monthlyTotal: number;
  timeline: string;
  breakdown: { label: string; amount: number }[];
};

/** Core estimate logic — shared by the UI and the API route. */
export function calculateEstimate(input: CalculatorInput): CalculatorResult {
  const type =
    calculatorConfig.websiteTypes.find((t) => t.id === input.websiteType) ??
    calculatorConfig.websiteTypes[1];

  const pages = Math.min(
    calculatorConfig.pages.max,
    Math.max(calculatorConfig.pages.min, Math.round(input.pages || calculatorConfig.pages.default)),
  );

  const extraPages = Math.max(0, pages - calculatorConfig.pages.included);
  const pagesPrice = extraPages * calculatorConfig.pages.pricePerPage;

  const featuresPrice = input.features.reduce((sum, id) => {
    const f = calculatorConfig.features.find((x) => x.id === id);
    return sum + (f && !f.free ? f.price : 0);
  }, 0);

  const supportOption =
    calculatorConfig.support.find((s) => s.id === input.support) ?? calculatorConfig.support[0];

  const oneTimeTotal = type.basePrice + pagesPrice + featuresPrice;

  const breakdown: { label: string; amount: number }[] = [
    { label: `${type.label} — base build`, amount: type.basePrice },
  ];
  if (extraPages > 0) {
    breakdown.push({
      label: `${extraPages} extra page${extraPages > 1 ? 's' : ''} (₹${calculatorConfig.pages.pricePerPage} each)`,
      amount: pagesPrice,
    });
  }
  for (const id of input.features) {
    const f = calculatorConfig.features.find((x) => x.id === id);
    if (f && !f.free) breakdown.push({ label: f.label, amount: f.price });
  }

  const timeline =
    calculatorConfig.timelines.find((t) => pages <= t.maxPages)?.label ?? '4–8 weeks';

  return {
    basePrice: type.basePrice,
    pagesPrice,
    featuresPrice,
    oneTimeTotal,
    monthlyTotal: supportOption.monthlyPrice,
    timeline,
    breakdown,
  };
}
