'use client';

/**
 * ShareButtons — X, LinkedIn, WhatsApp and copy-link share actions.
 */
import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  const encoded = { url: encodeURIComponent(url), title: encodeURIComponent(title) };

  const links = [
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encoded.title}&url=${encoded.url}`,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encoded.title}%20${encoded.url}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent/50 hover:text-accent"
          aria-label={`Share on ${l.label}`}
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent/50 hover:text-accent"
        aria-label="Copy link to this article"
      >
        {copied ? <Check size={13} className="text-success" aria-hidden /> : <Link2 size={13} aria-hidden />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  );
}
