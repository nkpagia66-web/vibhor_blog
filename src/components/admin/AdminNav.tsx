'use client';

/**
 * AdminNav — sidebar navigation highlighting the active section.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, FolderKanban, Calculator, FileText, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/pricing', label: 'Pricing', icon: Calculator },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Admin navigation">
      {items.map((item) => {
        const active =
          item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-card hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <item.icon size={16} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
