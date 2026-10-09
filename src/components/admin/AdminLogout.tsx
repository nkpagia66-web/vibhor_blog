'use client';

/**
 * AdminLogout — clears the session cookie and returns to the login page.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function AdminLogout() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold transition-colors hover:border-danger/40 hover:text-danger disabled:opacity-50"
    >
      <LogOut size={13} aria-hidden /> {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
