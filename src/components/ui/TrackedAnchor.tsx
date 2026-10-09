'use client';

/**
 * TrackedAnchor — external/internal link with an analytics click handler.
 * Server components cannot pass onClick functions into the tree, so pages
 * that need tracked raw anchors use this client component instead.
 */
import { track, type AnalyticsEvent } from '@/lib/analytics';
import type { ReactNode } from 'react';

export function TrackedAnchor({
  href,
  event,
  params,
  className,
  children,
  external = true,
}: {
  href: string;
  event: AnalyticsEvent;
  params?: Record<string, string | number | boolean>;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={className}
      onClick={() => track(event, params)}
    >
      {children}
    </a>
  );
}
