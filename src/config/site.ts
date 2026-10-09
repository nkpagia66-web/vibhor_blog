/**
 * Central site configuration.
 * Contact details, brand info and navigation live here — edit once, applied everywhere.
 * Values that should be editable from the admin live in the SiteSetting table instead;
 * env vars override the constants below.
 */

export const siteConfig = {
  name: 'Vibhor Agarwal Pagia',
  shortName: 'Vibhor',
  title: 'Vibhor Agarwal Pagia — Web Designer & Full-Stack Developer',
  tagline: 'Techy, detail-obsessed web designer & full-stack developer',
  description:
    'I design and build fast, modern, production-ready websites, e-commerce platforms and full-stack applications for businesses that want a stronger presence online.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vibhoragarwal.blog',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hptpled@gmail.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '917668397233',
  whatsappDisplay: '+91 7668397233',
  locale: 'en_IN',
  foundedYear: 2020,
  keywords: [
    'web developer India',
    'website developer India',
    'freelance web developer',
    'website development services',
    'e-commerce website developer',
    'Next.js developer',
    'React developer',
    'business website development',
    'custom website development',
  ],
} as const;

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/projects' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const footerNavigation = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Quote Calculator', href: '/request-website' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
] as const;

/** Default pre-filled WhatsApp message for general enquiries. */
export const defaultWhatsAppMessage =
  "Hi Vibhor, I found your website and I'm interested in getting a website for my business.";

/** Build a wa.me deep link with a pre-filled message. */
export function whatsappLink(message: string = defaultWhatsAppMessage): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
