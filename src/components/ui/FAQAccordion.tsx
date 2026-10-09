'use client';

/**
 * FAQAccordion — accessible disclosure list used on /faq and the homepage.
 */
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Faq } from '@/config/faqs';

export function FAQAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.question} className="card overflow-hidden">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
              >
                <span className="font-semibold leading-6">{faq.question}</span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={cn(
                    'shrink-0 text-muted-foreground transition-transform duration-300',
                    isOpen && 'rotate-180 text-accent',
                  )}
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-button-${i}`}
              hidden={!isOpen}
              className="border-t border-border px-5 py-4 sm:px-6"
            >
              <p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
