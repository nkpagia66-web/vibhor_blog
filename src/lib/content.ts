/**
 * Unified content access layer.
 *
 * Every public page reads through these functions. They try the database
 * first and fall back to the typed config in src/config/* when the DB is
 * unreachable or the record does not exist. Admin edits upsert DB rows,
 * which then win over config — so nothing is hard-coded in UI components.
 */

import { prisma } from '@/lib/db';
import { projects as configProjects, type Project } from '@/config/projects';
import { services as configServices, type Service } from '@/config/services';
import { pricingPlans as configPlans, type PricingPlan } from '@/config/pricing';
import { faqs as configFaqs, type Faq } from '@/config/faqs';

/** Run a DB query, returning `fallback` on any failure (missing DB, etc.). */
async function withFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

/* ---------------------------------- Projects --------------------------------- */

type ProjectRow = {
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string | null;
  technologies: string[];
  features: string[];
  image: string | null;
  liveUrl: string;
  githubUrl: string | null;
  caseStudy: unknown;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

function rowToProject(row: ProjectRow, fallbackLive: boolean): Project {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category as Project['category'],
    description: row.description,
    longDescription: row.longDescription ?? undefined,
    technologies: row.technologies,
    features: row.features,
    image: row.image ?? undefined,
    liveUrl: row.liveUrl,
    githubUrl: row.githubUrl ?? undefined,
    caseStudy:
      row.caseStudy && typeof row.caseStudy === 'object'
        ? (row.caseStudy as Project['caseStudy'])
        : undefined,
    featured: row.featured,
    live: fallbackLive,
  };
}

export async function getProjects(): Promise<Project[]> {
  const rows = await withFallback(
    () => prisma.project.findMany({ where: { active: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
    null as ProjectRow[] | null,
  );
  if (!rows || rows.length === 0) return configProjects;

  // DB rows win by slug; config-only projects are appended (e.g. not yet entered in admin).
  const dbBySlug = new Map(rows.map((r) => [r.slug, r]));
  const merged: Project[] = rows.map((r) =>
    rowToProject(r, configProjects.find((c) => c.slug === r.slug)?.live ?? false),
  );
  for (const c of configProjects) {
    if (!dbBySlug.has(c.slug)) merged.push(c);
  }
  return merged.sort((a, b) => Number(b.featured) - Number(a.featured));
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const list = await getProjects();
  return list.find((p) => p.slug === slug);
}

/* --------------------------------- Services --------------------------------- */

type ServiceRow = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  features: string[];
  icon: string;
  featured: boolean;
  sortOrder: number;
  active: boolean;
};

export async function getServices(): Promise<Service[]> {
  const rows = await withFallback(
    () => prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    null as ServiceRow[] | null,
  );
  if (!rows || rows.length === 0) return configServices;

  const merged: Service[] = rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    shortDescription: r.shortDescription,
    description: r.description,
    benefits: r.features,
    icon: r.icon,
    featured: r.featured,
  }));
  const dbSlugs = new Set(rows.map((r) => r.slug));
  for (const s of configServices) if (!dbSlugs.has(s.slug)) merged.push(s);
  return merged;
}

/* ---------------------------------- Pricing --------------------------------- */

type PlanRow = {
  slug: string;
  name: string;
  price: number;
  monthlyPrice: number | null;
  billingType: string;
  description: string;
  audience: string;
  features: string[];
  recommended: boolean;
  ctaText: string;
  active: boolean;
  sortOrder: number;
};

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const rows = await withFallback(
    () => prisma.pricingPlan.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    null as PlanRow[] | null,
  );
  if (!rows || rows.length === 0) return configPlans;

  const merged: PricingPlan[] = rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    price: r.price,
    monthlyPrice: r.monthlyPrice ?? undefined,
    billingType: r.billingType as PricingPlan['billingType'],
    description: r.description,
    audience: r.audience,
    features: r.features,
    recommended: r.recommended,
    ctaText: r.ctaText,
    active: r.active,
    sortOrder: r.sortOrder,
  }));
  const dbSlugs = new Set(rows.map((r) => r.slug));
  for (const p of configPlans) if (!dbSlugs.has(p.slug)) merged.push(p);
  return merged.sort((a, b) => a.sortOrder - b.sortOrder);
}

/* ----------------------------------- FAQs ----------------------------------- */

export async function getFaqs(): Promise<Faq[]> {
  const rows = await withFallback(
    () => prisma.faq.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    null as { question: string; answer: string; category: string }[] | null,
  );
  if (!rows || rows.length === 0) return configFaqs;
  return rows.map((r) => ({
    question: r.question,
    answer: r.answer,
    category: r.category as Faq['category'],
  }));
}
