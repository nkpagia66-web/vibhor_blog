/**
 * Project/Work catalogue — single source of truth for /projects, project detail
 * pages and the homepage featured-work section.
 *
 * Descriptions are factual and conservative: sites that could not be verified
 * live during the audit (DNS/parked) are described only at category level.
 * When the database has projects seeded, the DB wins (see src/lib/content.ts).
 */

export type ProjectCategory =
  | 'Websites'
  | 'E-commerce'
  | 'Web Applications'
  | 'Mobile'
  | 'Other';

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  description: string;
  longDescription?: string;
  technologies: string[];
  features: string[];
  image?: string; // path under /public, e.g. "/projects/geteverygoods.png"
  liveUrl: string;
  githubUrl?: string;
  caseStudy?: {
    challenge: string;
    approach: string;
    outcome: string;
  };
  featured: boolean;
  /** true when the live URL responded during the audit */
  live: boolean;
};

export const projectCategories: ProjectCategory[] = [
  'Websites',
  'E-commerce',
  'Web Applications',
  'Mobile',
  'Other',
];

export const projects: Project[] = [
  {
    slug: 'geteverygoods',
    name: 'GetEveryGoods',
    category: 'E-commerce',
    description:
      'Multi-vendor e-commerce marketplace connecting verified sellers with customers across India, with escrow-protected orders and a broad product catalogue.',
    longDescription:
      'GetEveryGoods is a multi-vendor online marketplace built for the Indian market. Sellers list products across categories such as electronics, fashion, home goods and groceries, while buyers get escrow-protected payments, order tracking and standardised delivery windows. The platform needed to handle catalogue scale, vendor onboarding and a trustworthy checkout flow.',
    technologies: [],
    features: [
      'Multi-vendor product catalogue',
      'Escrow-protected payments',
      'Cart, checkout and order tracking',
      'Search and category browsing',
      'Seller and buyer accounts',
    ],
    image: '/projects/geteverygoods.svg',
    liveUrl: 'https://geteverygoods.com',
    caseStudy: {
      challenge:
        'A marketplace must earn trust between unknown buyers and sellers while keeping the shopping experience fast across a large, ever-changing catalogue.',
      approach:
        'Built around a structured product catalogue with category search, account-based ordering and an escrow-style payment flow so funds only release on fulfilment.',
      outcome:
        'A live marketplace serving customers across India with 100+ listed suppliers and standardised delivery windows.',
    },
    featured: true,
    live: true,
  },
  {
    slug: 'anant-innovations',
    name: 'Anant Innovations',
    category: 'Websites',
    description:
      'Corporate website for a technology company offering software development, AI and digital transformation services to startups and enterprises.',
    longDescription:
      'Anant Innovations is a technology solutions company. The website presents their positioning — "Innovating Ideas. Building the Future." — along with their service lines spanning software development, AI, web solutions and digital transformation, designed to generate enquiries from startups and enterprises.',
    technologies: [],
    features: [
      'Service line presentation',
      'Clear enquiry call-to-actions',
      'Responsive, mobile-first layout',
      'Fast static page delivery',
    ],
    image: '/projects/anant-innovations.svg',
    liveUrl: 'https://anantinnovations.online',
    caseStudy: {
      challenge:
        'A technology company needs a site that communicates a broad service portfolio — software, AI, web and digital transformation — without overwhelming first-time visitors.',
      approach:
        'Structured the site around a strong hero statement and grouped service sections, each ending in a clear enquiry path, with a responsive layout built for fast load times.',
      outcome:
        'A live corporate site that positions the company as a modern technology solutions provider and routes visitors to enquiries.',
    },
    featured: true,
    live: true,
  },
  {
    slug: 'kashtnivaran-balaji-mandir-foundation',
    name: 'Kast Nivaran Balaji Mandir Foundation',
    category: 'Websites',
    description:
      'Website for the Kast Nivaran Balaji Mandir Foundation, presenting the foundation’s work and giving visitors a clear way to reach out.',
    technologies: [],
    features: [
      'Foundation information pages',
      'Contact and enquiry options',
      'Mobile-friendly layout',
    ],
    image: '/projects/kashtnivaran-balaji.svg',
    liveUrl: 'https://kashtnivaranbalaji-mandirfoundation.org',
    featured: false,
    live: false,
  },
  {
    slug: 'kgn-industries',
    name: 'KGN Industries',
    category: 'Websites',
    description:
      'Business website for KGN Industries, built to present the company’s offerings and generate enquiries from prospective clients.',
    technologies: [],
    features: [
      'Company profile and offerings',
      'Enquiry call-to-actions',
      'Responsive layout',
    ],
    image: '/projects/kgn-industries.svg',
    liveUrl: 'https://kgnindustries.online',
    featured: false,
    live: false,
  },
  {
    slug: 'indrey-cycle-solutions',
    name: 'Indrey Cycle Solutions',
    category: 'Websites',
    description:
      'Website for Indrey Cycle Solutions, designed to showcase the business and make it easy for customers to get in touch.',
    technologies: [],
    features: [
      'Service and product presentation',
      'Contact integration',
      'Mobile-first layout',
    ],
    image: '/projects/indrey-cycle-solutions.svg',
    liveUrl: 'https://indreycyclesolutions.online',
    featured: false,
    live: false,
  },
  {
    slug: 'kng-traders',
    name: 'KNG Traders',
    category: 'Websites',
    description:
      'Business website for KNG Traders, presenting the trading business online with straightforward ways for customers to make contact.',
    technologies: [],
    features: [
      'Business profile pages',
      'Enquiry contact flow',
      'Responsive layout',
    ],
    image: '/projects/kng-traders.svg',
    liveUrl: 'https://kngtraders.online',
    featured: false,
    live: false,
  },
  {
    slug: 'harish-seva',
    name: 'Harish Seva',
    category: 'Websites',
    description:
      'Website for Harish Seva, giving the organisation an online presence with clear information and contact options for visitors.',
    technologies: [],
    features: [
      'Information pages',
      'Contact options',
      'Mobile-friendly layout',
    ],
    image: '/projects/harish-seva.svg',
    liveUrl: 'https://harishseva.in',
    featured: false,
    live: false,
  },
  {
    slug: 'anant-traders',
    name: 'Anant Traders',
    category: 'Websites',
    description:
      'Online presence for Anant Traders, built to showcase the business and capture customer enquiries.',
    technologies: [],
    features: [
      'Business showcase',
      'Enquiry capture',
      'Responsive layout',
    ],
    image: '/projects/anant-traders.svg',
    liveUrl: 'https://ananttraders.store',
    featured: false,
    live: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
