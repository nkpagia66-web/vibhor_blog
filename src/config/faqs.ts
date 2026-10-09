/**
 * FAQ content — used on /faq and the homepage FAQ section.
 * Renders FAQPage structured data for SEO (see src/lib/seo.ts).
 * When the database has FAQs seeded, the DB wins (see src/lib/content.ts).
 */

export type Faq = {
  question: string;
  answer: string;
  category: 'Pricing' | 'Process' | 'Support' | 'Capabilities';
};

export const faqs: Faq[] = [
  {
    question: 'How much does a website cost?',
    answer:
      'A basic business website starts at ₹9,999 as a one-time development fee, with an optional ₹1,499/month care plan. A more complete professional website is ₹24,999. E-commerce sites, dashboards and custom applications are quoted after understanding your requirements — you can build an estimate instantly with the quote calculator on this site.',
    category: 'Pricing',
  },
  {
    question: 'How long does website development take?',
    answer:
      'A small business website typically takes 1–2 weeks; larger multi-page sites take 2–4 weeks; e-commerce and custom applications usually take 4–8 weeks. The exact timeline depends on scope, content readiness and how quickly feedback comes back during reviews.',
    category: 'Process',
  },
  {
    question: 'Do you provide hosting?',
    answer:
      'Yes. Hosting can be set up as part of the optional monthly care plan, or I can deploy to hosting you already own. You always retain ownership of your own domain and hosting accounts.',
    category: 'Support',
  },
  {
    question: 'Do you provide maintenance?',
    answer:
      'Yes — the optional ₹1,499/month plan covers routine maintenance, minor content updates, security and backup upkeep, basic monitoring and technical support. Larger changes are scoped separately so expectations stay clear.',
    category: 'Support',
  },
  {
    question: 'Can you redesign an existing website?',
    answer:
      'Yes. Redesigns focus on modernizing looks, speed and conversions while preserving the content, rankings and functionality that already work, with a migration plan to keep downtime minimal.',
    category: 'Capabilities',
  },
  {
    question: 'Can you build e-commerce websites?',
    answer:
      'Yes — product catalogues, search, cart and checkout, payment gateway integration, order management and seller/vendor flows are all within scope.',
    category: 'Capabilities',
  },
  {
    question: 'Can you build custom web applications?',
    answer:
      'Yes. Custom applications are built around your actual workflow — internal tools, customer portals, marketplaces and more — with a scalable architecture and clean, documented code.',
    category: 'Capabilities',
  },
  {
    question: 'Can you integrate payment gateways?',
    answer:
      'Yes. Payment gateway integration is available for online stores and booking flows using providers that support your market and currency.',
    category: 'Capabilities',
  },
  {
    question: 'Can you build admin panels?',
    answer:
      'Yes. Admin dashboards for managing content, users, products, orders and settings — with authenticated access and role-based permissions — are a core part of my work.',
    category: 'Capabilities',
  },
  {
    question: 'Can you maintain my website after launch?',
    answer:
      'Yes. Post-launch support is available through the monthly care plan covering updates, backups, monitoring and small content changes. Ongoing feature work can be arranged separately.',
    category: 'Support',
  },
  {
    question: 'Can I request custom functionality?',
    answer:
      'Absolutely. Describe what you need in the request form or on a call, and you will get a proposal covering scope, timeline and price before any work begins.',
    category: 'Process',
  },
];
