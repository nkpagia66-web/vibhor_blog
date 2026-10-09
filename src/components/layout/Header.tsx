'use client';

/**
 * Header — sticky glass nav with mobile menu, CTA and theme toggle.
 */
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { navigation, siteConfig, whatsappLink } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';

function HeaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  // highlight the request page CTA when the calculator was used
  useEffect(() => {
    if (searchParams.get('from') === 'calculator') {
      track('quote_calculator_used', { surface: 'header' });
    }
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-background/0',
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 font-display text-lg font-bold tracking-tight"
          aria-label={`${siteConfig.name} — home`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
            VA
          </span>
          <span className="hidden sm:inline">{siteConfig.shortName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'text-accent' : 'text-muted-foreground hover:text-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:border-accent/50 hover:text-accent sm:inline-flex" />
          <Button
            href="/request-website"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => track('pricing_cta_clicked', { location: 'header' })}
          >
            Start Your Project
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
          <nav className="container-site flex flex-col gap-1 py-4" aria-label="Mobile navigation">
            {navigation.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-base font-medium',
                    active ? 'bg-muted text-accent' : 'text-foreground',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 flex flex-col gap-2">
              <Button href="/request-website" className="w-full">
                Start Your Project
              </Button>
              <Button
                href={whatsappLink()}
                variant="whatsapp"
                className="w-full"
                target="_blank"
                onClick={() => track('whatsapp_clicked', { location: 'header_mobile' })}
              >
                Chat on WhatsApp
              </Button>
              <div className="flex justify-center pt-1">
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderInner />
    </Suspense>
  );
}
