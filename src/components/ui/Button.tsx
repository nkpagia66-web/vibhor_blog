'use client';

/**
 * Button primitive — variants, sizes, polymorphic (Link or button).
 * Client component so it can own its click handler; server pages pass
 * serializable `trackEvent`/`trackParams` instead of onClick functions.
 */
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { track, type AnalyticsEvent } from '@/lib/analytics';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-foreground hover:opacity-90 shadow-glow border border-transparent',
  secondary:
    'bg-foreground text-background hover:opacity-90 border border-transparent',
  outline:
    'border border-border bg-card text-foreground hover:border-accent/60 hover:text-accent',
  ghost: 'text-foreground hover:bg-muted',
  whatsapp:
    'bg-[#25D366] text-[#0b3d21] hover:brightness-95 border border-transparent font-semibold',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  /** Analytics event fired on click (client-side). */
  trackEvent?: AnalyticsEvent;
  trackParams?: Record<string, string | number | boolean>;
};

type ButtonAsButton = CommonProps & {
  href?: undefined;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: () => void;
  ariaLabel?: string;
  target?: string;
  rel?: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    icon,
    ariaLabel,
    trackEvent,
    trackParams,
  } = props;

  const handleClick = () => {
    if (trackEvent) track(trackEvent, trackParams);
    props.onClick?.();
  };
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  );

  if ('href' in props && props.href !== undefined) {
    return (
      <Link
        href={props.href}
        className={classes}
        aria-label={ariaLabel}
        target={props.target}
        rel={props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined)}
        onClick={handleClick}
      >
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button
      type={(props as ButtonAsButton).type ?? 'button'}
      className={classes}
      onClick={handleClick}
      disabled={(props as ButtonAsButton).disabled}
      aria-label={ariaLabel}
    >
      {children}
      {icon}
    </button>
  );
}
