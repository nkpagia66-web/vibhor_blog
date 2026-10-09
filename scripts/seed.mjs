/**
 * Database seed — run with: npm run db:seed
 *
 * Seeds blog posts and site settings. Projects, pricing, services and FAQs
 * live in src/config/* and are merged with DB records at read time (DB wins
 * by slug), so they do not need seeding — editing them in the admin upserts
 * a DB record that then overrides the config.
 *
 * Note: this is a plain ESM script (no TS loader needed).
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const starterPosts = [
  {
    slug: 'how-much-does-a-website-cost',
    title: 'How Much Does a Website Cost in India (2026 Guide)',
    excerpt:
      'A transparent breakdown of website pricing — one-time development fees, monthly care plans, and what drives the cost of e-commerce and custom applications.',
    category: 'Business',
    tags: ['pricing', 'websites', 'small-business'],
    featured: true,
    published: true,
    readingTimeMin: 6,
    content: `# How Much Does a Website Cost in India (2026 Guide)

Website pricing varies widely because scope varies widely. Here is a transparent, practical breakdown.

## One-time development vs monthly care

Two different costs get mixed up constantly:

- **One-time development fee** — design, build, testing and launch. You pay this once.
- **Monthly care plan** — hosting, maintenance, minor updates, backups and support. You pay this monthly, and it is optional.

## Typical price ranges

| Type | Typical one-time cost |
| --- | --- |
| Small business website | ₹9,999 – ₹24,999 |
| Professional multi-page website | ₹24,999+ |
| E-commerce store | ₹34,999+ (depends on catalogue size) |
| Custom web application | Quoted after scoping |

## What moves the price

1. **Number of pages** — more pages means more design and content work.
2. **Features** — admin panels, payments, bookings, user accounts and AI features each add real engineering time.
3. **Content readiness** — text, images and branding supplied early keeps costs down.
4. **Integrations** — payment gateways, CRMs and third-party APIs add complexity.

## Get an exact number

Use the quote calculator on this site to build an estimate in under a minute, then send it through — the final price is always confirmed after a short discussion about your actual requirements.

> Estimates are not binding quotations. Final pricing depends on scope.
`,
  },
  {
    slug: 'react-nextjs-modern-websites',
    title: 'Why Modern Business Websites Are Built with React & Next.js',
    excerpt:
      'Server-side rendering, strong typing and fast loads — what React and Next.js actually mean for your website’s speed, SEO and maintainability.',
    category: 'Technology',
    tags: ['nextjs', 'react', 'performance'],
    featured: false,
    published: true,
    readingTimeMin: 5,
    content: `# Why Modern Business Websites Are Built with React & Next.js

Next.js has become the default choice for production websites, and not because it is trendy.

## SEO without compromises

Next.js renders pages on the server, so search engines and social platforms receive complete HTML — not an empty shell waiting for JavaScript. That means reliable indexing and correct link previews on WhatsApp, LinkedIn and X.

## Performance

- Server rendering removes the blank-page flash
- Automatic code splitting loads only what each page needs
- Image and font optimization protect Core Web Vitals

## Maintainability

TypeScript catches whole classes of bugs before they ship. Component reuse means adding a page later costs a fraction of what it cost the first time.

## The practical takeaway

The framework matters less than the discipline: semantic HTML, real content hierarchy, optimized assets and fast hosting. Next.js simply makes all of those easier to do consistently.
`,
  },
];

async function main() {
  console.log('Seeding database...');

  for (const post of starterPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {}, // never overwrite edited posts
      create: {
        ...post,
        tags: post.tags,
        publishedAt: new Date(),
        metaTitle: null,
        metaDescription: null,
        coverImage: null,
      },
    });
  }

  const settings = {
    heroHeadline: 'Websites & Digital Experiences That Help Businesses Grow.',
    heroSubline:
      'I design and build fast, modern and production-ready websites, e-commerce platforms and full-stack applications.',
    availabilityText: 'Available for freelance & remote work',
    ctaPrimary: 'Start Your Project',
    ctaSecondary: 'View My Work',
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  console.log(`Seeded ${starterPosts.length} blog posts and ${Object.keys(settings).length} site settings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
