/**
 * Guarded admin shell — all dashboard pages require a valid session.
 * Unauthenticated visitors are redirected to /admin/login.
 */
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminLogout } from '@/components/admin/AdminLogout';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="border-b border-border bg-muted/30">
      <div className="container-site">
        <div className="flex min-h-[70vh] flex-col gap-6 py-8 lg:flex-row">
          {/* sidebar */}
          <aside className="lg:w-56 lg:shrink-0">
            <div className="flex items-center justify-between gap-3 lg:sticky lg:top-24 lg:block">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin
                </p>
                <p className="mt-1 truncate text-sm font-medium">{session.sub}</p>
              </div>
              <AdminLogout />
            </div>
            <div className="mt-4 lg:mt-6">
              <AdminNav />
            </div>
            <Link
              href="/"
              className="mt-4 hidden text-xs text-muted-foreground hover:text-foreground lg:block"
            >
              ← Back to website
            </Link>
          </aside>

          {/* content */}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
