import type { NearbyStay } from '@play/shared';
import { Star } from 'lucide-react';

type Props = {
  stays: NearbyStay[];
};

export function NearbyStays({ stays }: Props) {
  if (stays.length === 0) return null;

  return (
    <section id="nearby" className="border-b border-line py-10">
      <h2 className="mb-6 text-[22px] font-semibold">Explore other options</h2>
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 scroll-smooth">
        {stays.map((stay) => (
          <article
            key={stay.id}
            className="w-[280px] shrink-0 cursor-pointer transition hover:opacity-95"
          >
            <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-grey200">
              <img src={stay.imageUrl} alt="" className="h-full w-full object-cover" />
              {stay.isGuestFavourite && (
                <span className="absolute left-3 top-3 rounded bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">
                  Guest favourite
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium">{stay.title}</h3>
                <p className="text-sm text-muted2">{stay.location}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-sm">
                <Star className="h-3 w-3 fill-ink stroke-ink" />
                {stay.rating.toFixed(2)}
              </div>
            </div>
            <p className="mt-1 text-sm">
              <span className="font-semibold">
                {stay.currencySymbol}
                {stay.pricePerNight.toLocaleString('en-IN')}
              </span>{' '}
              night
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
