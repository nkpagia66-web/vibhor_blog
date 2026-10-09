/**
 * Icon — maps lucide-react icon names (strings in config) to components.
 * Config files store icon names as plain strings so they stay serializable.
 */
import {
  Building2,
  ShoppingCart,
  Blocks,
  LayoutDashboard,
  RefreshCw,
  Waypoints,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Gauge,
  Code2,
  Rocket,
  Users,
  MessageCircle,
  Mail,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Phone,
  Globe,
  TrendingUp,
  Layers,
  Headphones,
  PencilRuler,
  Send,
  Calculator,
  ChevronDown,
  ExternalLink,
  CalendarDays,
  FolderKanban,
  FileText,
  Inbox,
  type LucideIcon,
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  Building2,
  ShoppingCart,
  Blocks,
  LayoutDashboard,
  RefreshCw,
  Waypoints,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Gauge,
  Code2,
  Rocket,
  Users,
  MessageCircle,
  Mail,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Phone,
  Globe,
  TrendingUp,
  Layers,
  Headphones,
  PencilRuler,
  Send,
  Calculator,
  ChevronDown,
  ExternalLink,
  CalendarDays,
  FolderKanban,
  FileText,
  Inbox,
};

export function Icon({
  name,
  className,
  size = 20,
  strokeWidth = 1.75,
  ...rest
}: {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
  'aria-hidden'?: boolean | 'true' | 'false';
}) {
  const Cmp = icons[name] ?? Code2;
  return <Cmp className={className} size={size} strokeWidth={strokeWidth} aria-hidden {...rest} />;
}
