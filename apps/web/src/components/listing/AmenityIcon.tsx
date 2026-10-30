import type { LucideIcon } from 'lucide-react';
import {
  AlarmSmoke,
  Bath,
  Calendar,
  Camera,
  Car,
  Check,
  Droplets,
  Dumbbell,
  Laptop,
  PawPrint,
  Shirt,
  Snowflake,
  Tv,
  Utensils,
  Waves,
  Wifi,
  Wind,
} from 'lucide-react';

const map: Record<string, LucideIcon> = {
  utensils: Utensils,
  wifi: Wifi,
  laptop: Laptop,
  car: Car,
  waves: Waves,
  bath: Bath,
  paw: PawPrint,
  camera: Camera,
  alarm: AlarmSmoke,
  snowflake: Snowflake,
  tv: Tv,
  washing: Shirt,
  dumbbell: Dumbbell,
  wind: Wind,
  check: Check,
  droplet: Droplets,
  calendar: Calendar,
};

export function AmenityIcon({ name }: { name: string }) {
  const Icon = map[name] ?? Check;
  return <Icon className="h-6 w-6 shrink-0" strokeWidth={1.75} />;
}
