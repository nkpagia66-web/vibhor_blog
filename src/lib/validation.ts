/**
 * Input validation schemas (zod) shared by API routes and forms.
 */
import { z } from 'zod';

export const leadSourceSchema = z.enum(['contact', 'request-website', 'calculator']);

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.string().trim().email('Please enter a valid email').max(200),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,17}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  businessName: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined)),
  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  projectType: z.string().trim().max(100).optional().or(z.literal('').transform(() => undefined)),
  budget: z.string().trim().max(100).optional().or(z.literal('').transform(() => undefined)),
  message: z.string().trim().min(10, 'Please tell me a bit more (at least 10 characters)').max(5000),
  source: leadSourceSchema.default('contact'),
  details: z.record(z.unknown()).optional(), // calculator selections
  /** honeypot — must be empty; bots that fill it are silently dropped */
  company: z.string().max(0, 'Invalid submission').optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const leadStatusSchema = z.enum([
  'NEW',
  'CONTACTED',
  'IN_DISCUSSION',
  'PROPOSAL_SENT',
  'WON',
  'LOST',
]);

export const leadFilterSchema = z.object({
  status: leadStatusSchema.optional(),
  q: z.string().trim().max(100).optional(),
});

export const leadNoteSchema = z.object({
  body: z.string().trim().min(1, 'Note cannot be empty').max(2000),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').max(200),
});

/** Generic markdown length guard for blog content. */
export const blogPostSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers and hyphens')
    .max(160),
  excerpt: z.string().trim().min(10).max(400),
  content: z.string().trim().min(20).max(200_000),
  category: z.string().trim().max(60).default('General'),
  tags: z.array(z.string().trim().max(40)).max(10).default([]),
  coverImage: z.string().trim().max(300).nullable().default(null),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  metaTitle: z.string().trim().max(70).nullable().default(null),
  metaDescription: z.string().trim().max(170).nullable().default(null),
});

export const projectSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers and hyphens')
    .max(120),
  category: z.enum(['Websites', 'E-commerce', 'Web Applications', 'Mobile', 'Other']),
  description: z.string().trim().min(10).max(600),
  longDescription: z.string().trim().max(5000).nullable().default(null),
  technologies: z.array(z.string().trim().max(40)).max(20).default([]),
  features: z.array(z.string().trim().max(120)).max(20).default([]),
  image: z.string().trim().max(300).nullable().default(null),
  liveUrl: z.string().trim().url('Must be a valid URL').max(300),
  githubUrl: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .max(300)
    .nullable()
    .default(null),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  caseStudy: z
    .object({
      challenge: z.string().trim().max(3000),
      approach: z.string().trim().max(3000),
      outcome: z.string().trim().max(3000),
    })
    .nullable()
    .default(null),
});

export const pricingPlanSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  price: z.number().int().min(0).max(10_000_000),
  monthlyPrice: z.number().int().min(0).max(1_000_000).nullable().default(null),
  billingType: z.enum(['one_time', 'one_time_plus_monthly', 'custom']),
  description: z.string().trim().min(5).max(300),
  audience: z.string().trim().max(200).default(''),
  features: z.array(z.string().trim().max(160)).max(25).default([]),
  recommended: z.boolean().default(false),
  ctaText: z.string().trim().max(60).default('Get My Website'),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(9999).default(0),
});
