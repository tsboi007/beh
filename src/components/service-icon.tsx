import {
  Activity,
  Aperture,
  Baby,
  Eye,
  ScanEye,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  eye: Eye,
  "scan-eye": ScanEye,
  sparkles: Sparkles,
  activity: Activity,
  baby: Baby,
  aperture: Aperture,
  "shield-plus": ShieldPlus,
  stethoscope: Stethoscope,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = SERVICE_ICONS[name] ?? Eye;
  return <Icon className={className} aria-hidden strokeWidth={1.75} />;
}
