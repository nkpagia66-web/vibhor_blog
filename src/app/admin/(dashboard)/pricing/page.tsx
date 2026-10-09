/**
 * /admin/pricing — edit pricing plans (name, price, features, active flag).
 */
import { prisma } from '@/lib/db';
import { getPricingPlans } from '@/lib/content';
import { PricingManager } from '@/components/admin/PricingManager';

export const dynamic = 'force-dynamic';

export default async function AdminPricingPage() {
  let dbPlans: {
    id: string;
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
  }[] = [];
  let dbOk = true;
  try {
    dbPlans = await prisma.pricingPlan.findMany({ orderBy: { sortOrder: 'asc' } });
  } catch {
    dbOk = false;
  }

  const publicPlans = await getPricingPlans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit package names, prices and features — changes apply across the whole site. Config
          defaults live in{' '}
          <code className="rounded bg-muted px-1">src/config/pricing.ts</code>; DB edits override them.
        </p>
      </div>

      {!dbOk && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          Database unreachable — pricing edits unavailable until{' '}
          <code className="rounded bg-muted px-1">DATABASE_URL</code> is configured (
          <code className="rounded bg-muted px-1">npm run db:push</code>).
        </div>
      )}

      <PricingManager dbOk={dbOk} dbPlans={dbPlans} fallbackPlans={publicPlans} />
    </div>
  );
}
