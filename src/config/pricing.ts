/**
 * Pricing configuration — single source of truth for every price on the site.
 * Nothing hard-codes rupee amounts in UI components; they all read from here
 * (or from the PricingPlan table when seeded — see src/lib/content.ts).
 *
 * billingType:
 *   "one_time"         -> price only
 *   "one_time_plus_monthly" -> price + monthlyPrice
 *   "custom"           -> price = 0, displayed as "Let's discuss"
 */

export type BillingType = 'one_time' | 'one_time_plus_monthly' | 'custom';

export type PricingPlan = {
  slug: string;
  name: string;
  price: number; // INR, one-time setup/development fee; 0 for custom
  monthlyPrice?: number; // INR/month, optional
  billingType: BillingType;
  description: string;
  audience: string;
  features: string[];
  recommended: boolean;
  ctaText: string;
  active: boolean;
  sortOrder: number;
};

export const pricingPlans: PricingPlan[] = [
  {
    slug: 'starter',
    name: 'Starter',
    price: 9999,
    monthlyPrice: 1499,
    billingType: 'one_time_plus_monthly',
    description: 'A professional website to establish your presence online.',
    audience: 'For individuals and small businesses',
    features: [
      'One-time development fee of ₹9,999',
      'Mobile-responsive design',
      'Core pages for your business',
      'Contact form with email delivery',
      'WhatsApp integration button',
      'Basic on-page SEO setup',
      'Launch and deployment support',
      'Monthly plan available for hosting & upkeep (₹1,499/month)',
    ],
    recommended: false,
    ctaText: 'Get My Website',
    active: true,
    sortOrder: 1,
  },
  {
    slug: 'business',
    name: 'Business',
    price: 24999,
    billingType: 'one_time',
    description: 'A fuller, more professional website for growing businesses.',
    audience: 'For businesses requiring a more professional website',
    features: [
      'One-time development fee of ₹24,999',
      'Custom design tailored to your brand',
      'More pages and richer content sections',
      'Blog / news section',
      'Advanced forms and enquiry routing',
      'On-page SEO setup',
      'Analytics integration',
      'Performance-tuned build',
      'Launch and deployment support',
    ],
    recommended: true,
    ctaText: 'Get My Website',
    active: true,
    sortOrder: 2,
  },
  {
    slug: 'premium',
    name: 'Premium / Custom',
    price: 0,
    billingType: 'custom',
    description: 'Custom applications, e-commerce platforms, dashboards and advanced systems.',
    audience: 'For custom applications, e-commerce, dashboards and advanced systems',
    features: [
      'E-commerce with product & order management',
      'Admin dashboards and internal tools',
      'User accounts and authentication',
      'Payment gateway integration',
      'API and third-party integrations',
      'AI-powered features',
      'Ongoing support options',
      'Scope and timeline agreed before work begins',
    ],
    recommended: false,
    ctaText: "Let's discuss your requirements",
    active: true,
    sortOrder: 3,
  },
];

/**
 * Monthly subscription (₹1,499/month by default) — presented separately from
 * the one-time development fee so the distinction is always clear.
 */
export const subscriptionConfig = {
  name: 'Care & Hosting Plan',
  monthlyPrice: 1499,
  active: true,
  intro:
    'Optional monthly plan, separate from the one-time development fee. It covers the day-to-day work of keeping your website running after launch.',
  features: [
    'Website hosting management',
    'Routine website maintenance',
    'Technical support for issues',
    'Minor content updates',
    'Security and backup maintenance',
    'Basic uptime monitoring',
  ],
  note: 'Scope of work and update frequency are agreed per project — no unlimited changes or unlimited support claims.',
} as const;

/** Formats a plan price for display: ₹9,999 / Custom / ₹24,999 */
export function formatPlanPrice(plan: Pick<PricingPlan, 'price' | 'billingType'>): string {
  if (plan.billingType === 'custom') return "Let's discuss";
  return formatINR(plan.price);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
