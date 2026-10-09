/**
 * Root admin layout — passthrough. The auth guard lives in
 * (dashboard)/layout.tsx so the login page stays reachable.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
