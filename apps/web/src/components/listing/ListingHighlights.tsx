import type { ListingHighlight } from '@play/shared';
import { CalendarCheck, KeyRound, MapPin, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<ListingHighlight['icon'], LucideIcon> = {
  key: KeyRound,
  superhost: Star,
  location: MapPin,
  calendar: CalendarCheck,
};

type Props = {
  highlights: ListingHighlight[];
};

export function ListingHighlights({ highlights }: Props) {
  return (
    <section className="border-b border-line py-6">
      <ul className="space-y-6">
        {highlights.map((item) => {
          const Icon = iconMap[item.icon];
          const isSuperhost = item.icon === 'superhost';
          return (
            <li key={item.id} className="flex gap-4">
              <Icon
                className={`mt-0.5 h-6 w-6 shrink-0 stroke-[1.5] ${isSuperhost ? 'fill-ink' : ''}`}
                aria-hidden="true"
              />
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted2">{item.subtitle}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
