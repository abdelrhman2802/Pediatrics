import {
  Apple, Baby, Bone, Brain, Bug, Dna, Droplets, Filter, FlaskConical, Flower2, Gauge, HeartPulse,
  Network, Ribbon, Ruler, ShieldCheck, Siren, Utensils, Wind, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Apple, Baby, Bone, Brain, Bug, Dna, Droplets, Filter, FlaskConical, Flower2, Gauge, HeartPulse,
  Network, Ribbon, Ruler, ShieldCheck, Siren, Utensils, Wind,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = map[name] ?? Ruler;
  return <C className={className} aria-hidden />;
}
