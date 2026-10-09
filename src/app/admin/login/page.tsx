/**
 * /admin/login — admin sign-in. Not wrapped by the guarded admin layout
 * (it lives outside (dashboard) route group).
 */
import { LoginForm } from '@/components/admin/LoginForm';
import { hasAdminCredentials } from '@/lib/auth';
import { buildMetadata } from '@/lib/seo';
import { Section, Container } from '@/components/ui/Layout';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Admin Login',
  description: 'Administrator sign-in.',
  path: '/admin/login',
  noIndex: true,
});

export default function AdminLoginPage() {
  return (
    <Section size="lg">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight">Admin sign-in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Restricted area — authorised access only.
            </p>
          </div>
          <LoginForm configured={hasAdminCredentials()} />
        </div>
      </Container>
    </Section>
  );
}
