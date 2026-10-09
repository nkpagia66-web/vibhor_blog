/**
 * Layout + typography primitives.
 */
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('container-site', className)}>{children}</div>;
}

export function Section({
  children,
  className,
  id,
  size = 'md',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const pad = size === 'sm' ? 'py-14 sm:py-16' : size === 'lg' ? 'py-20 sm:py-28' : 'py-16 sm:py-20';
  return (
    <section id={id} className={cn(pad, className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
}

export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode;
  tone?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
}) {
  const tones = {
    default: 'bg-muted text-muted-foreground border-border',
    accent: 'bg-accent-soft text-accent border-accent/20',
    success: 'bg-success/10 text-success border-success/25',
    warning: 'bg-warning/10 text-warning border-warning/25',
    danger: 'bg-danger/10 text-danger border-danger/25',
  } as const;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const cls = cn('card p-6 transition-all duration-300', className);
  if (href) {
    return (
      <Link href={href} className={cn(cls, 'block hover:border-accent/40 hover:shadow-card')}>
        {children}
      </Link>
    );
  }
  return <div className={cls}>{children}</div>;
}
