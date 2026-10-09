/**
 * Services catalogue — single source of truth for /services and the homepage
 * services section. Edit here to update the UI everywhere; when the database
 * has services seeded, the DB wins (see src/lib/content.ts).
 */

export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  icon: string; // lucide icon name (see src/components/ui/Icon.tsx)
  featured: boolean;
};

export const services: Service[] = [
  {
    slug: 'business-websites',
    name: 'Business Websites',
    shortDescription: 'Professional websites that make small businesses look established and credible.',
    description:
      'Fast, mobile-first business websites built to convert visitors into enquiries — with clear messaging, strong calls to action and clean, maintainable code.',
    benefits: [
      'Mobile-first, responsive layout tested across screen sizes',
      'Clear call-to-action paths designed for enquiries',
      'On-page SEO fundamentals handled from day one',
      'Easy to update as your business grows',
    ],
    icon: 'Building2',
    featured: true,
  },
  {
    slug: 'ecommerce-websites',
    name: 'E-commerce Websites',
    shortDescription: 'Online stores with product management, cart, checkout and payments.',
    description:
      'Full online stores with product catalogues, search, cart and checkout flows, payment gateway integration and order management — built for real operations, not demos.',
    benefits: [
      'Product catalogue with categories, search and filters',
      'Secure payment gateway integration',
      'Order and inventory management workflows',
      'Optimised product pages for search and speed',
    ],
    icon: 'ShoppingCart',
    featured: true,
  },
  {
    slug: 'custom-web-applications',
    name: 'Custom Web Applications',
    shortDescription: 'Tailored web apps for workflows off-the-shelf tools cannot handle.',
    description:
      'Custom-built web applications designed around your actual business process — from internal tools to customer-facing products, with a scalable architecture.',
    benefits: [
      'Built around your real workflow, not a template',
      'Scalable architecture that grows with usage',
      'Role-based access and data integrity',
      'Clean, documented code you can hand to any team',
    ],
    icon: 'Blocks',
    featured: true,
  },
  {
    slug: 'admin-dashboards',
    name: 'Admin Dashboards',
    shortDescription: 'Internal dashboards to manage data, users and operations efficiently.',
    description:
      'Admin panels and dashboards that give you control over your data — manage users, content, orders and settings through a clean, secure interface.',
    benefits: [
      'Secure, authenticated admin access',
      'Data tables with search, filter and export',
      'Charts and summaries for quick decisions',
      'Granular permissions for team members',
    ],
    icon: 'LayoutDashboard',
    featured: true,
  },
  {
    slug: 'website-redesign',
    name: 'Website Redesign',
    shortDescription: 'Modern redesigns of outdated sites — without losing what already works.',
    description:
      'Redesign an existing website for better looks, speed and conversions while preserving the content, rankings and functionality that already work.',
    benefits: [
      'Fresh visual design with improved hierarchy',
      'Performance and Core Web Vitals improvements',
      'Preserves existing SEO value where possible',
      'Clear migration plan with minimal downtime',
    ],
    icon: 'RefreshCw',
    featured: false,
  },
  {
    slug: 'api-development',
    name: 'API Development',
    shortDescription: 'REST and GraphQL APIs that connect your products reliably.',
    description:
      'Well-structured REST and GraphQL APIs with authentication, validation and documentation — the backbone for apps, integrations and automations.',
    benefits: [
      'Consistent, versioned API design',
      'Authentication and rate limiting built in',
      'Input validation and error handling everywhere',
      'Clear documentation for future integrations',
    ],
    icon: 'Waypoints',
    featured: false,
  },
  {
    slug: 'mobile-applications',
    name: 'Mobile Applications',
    shortDescription: 'Mobile-friendly apps and responsive web experiences that feel native.',
    description:
      'Mobile applications and progressive web apps built alongside your website — sharing data, design language and authentication for a consistent experience.',
    benefits: [
      'Consistent design across web and mobile',
      'Shared backend with your website or app',
      'Offline-tolerant, fast-loading interfaces',
      'Deployable to app stores or the web',
    ],
    icon: 'Smartphone',
    featured: false,
  },
  {
    slug: 'ai-powered-applications',
    name: 'AI-Powered Applications',
    shortDescription: 'Practical AI features — chatbots, smart search, content assistance.',
    description:
      'AI features integrated into real products: chatbots, recommendation and smart search, content assistance and workflow automation — chosen where AI genuinely helps.',
    benefits: [
      'Chatbots trained on your own content',
      'Smart search and discovery experiences',
      'Automated content and data workflows',
      'Measured against real business outcomes',
    ],
    icon: 'Sparkles',
    featured: false,
  },
  {
    slug: 'website-maintenance',
    name: 'Website Maintenance',
    shortDescription: 'Ongoing maintenance so your site stays fast, secure and up to date.',
    description:
      'Scheduled maintenance covering updates, backups, monitoring and small content changes — so your site keeps running while you focus on your business.',
    benefits: [
      'Regular dependency and security updates',
      'Backup and restore readiness',
      'Uptime and performance monitoring',
      'Scheduled content changes',
    ],
    icon: 'ShieldCheck',
    featured: true,
  },
  {
    slug: 'seo-performance',
    name: 'SEO & Performance Optimization',
    shortDescription: 'Technical SEO and speed work so more people find — and stay on — your site.',
    description:
      'Technical SEO, structured data and performance optimization targeting strong Core Web Vitals, better crawlability and faster load times.',
    benefits: [
      'Technical SEO audit and fixes',
      'Structured data for rich results',
      'Core Web Vitals optimization (LCP, INP, CLS)',
      'Image, bundle and caching strategies',
    ],
    icon: 'Gauge',
    featured: false,
  },
];
