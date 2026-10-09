/**
 * 404 page — helpful navigation instead of a dead end.
 */
import { ArrowRight, Search } from 'lucide-react';
import { Section, Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Section size="lg">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Search size={28} aria-hidden />
          </span>
          <p className="mt-6 font-display text-6xl font-bold tracking-tight text-accent">404</p>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Page not found
          </h1>
          <p className="mt-4 text-muted-foreground">
            The page you are looking for may have moved or never existed. Try one of these instead.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/" size="lg">
              Go home
            </Button>
            <Button href="/projects" variant="outline" size="lg">
              See my work <ArrowRight size={16} aria-hidden />
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Contact me
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
