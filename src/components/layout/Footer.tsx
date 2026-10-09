'use client';

/**
 * Footer — brand, navigation columns, contact details, legal links.
 * Client component: attaches analytics handlers to contact links.
 */
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';
import { siteConfig, footerNavigation, whatsappLink } from '@/config/site';
import { track } from '@/lib/analytics';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container-site py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                VA
              </span>
              {siteConfig.name}
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-5 flex flex-col gap-2.5 text-sm">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-accent"
                onClick={() => track('whatsapp_clicked', { location: 'footer' })}
              >
                <MessageCircle size={16} aria-hidden /> {siteConfig.whatsappDisplay}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-accent"
              >
                <Mail size={16} aria-hidden /> {siteConfig.email}
              </a>
            </div>
          </div>

          <nav aria-label="Footer navigation" className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Site map
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Get started
            </h2>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <Link href="/request-website" className="font-medium hover:text-accent">
                Request a website
              </Link>
              <Link href="/pricing" className="font-medium hover:text-accent">
                View pricing
              </Link>
              <Link href="/projects" className="font-medium hover:text-accent">
                See my work
              </Link>
              <Link href="/faq" className="font-medium hover:text-accent">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
