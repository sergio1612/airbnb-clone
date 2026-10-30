import type { BookingInfo } from '@play/shared';
import { formatINR } from '../../lib/format';

type Props = {
  visible: boolean;
  booking: BookingInfo;
  rating: number;
  reviewCount: number;
};

export function StickySectionNav({ visible, booking, rating, reviewCount }: Props) {
  const links = [
    { href: '#photos', label: 'Photos' },
    { href: '#amenities', label: 'Amenities' },
    { href: '#reviews', label: 'Reviews' },
    { href: '#location', label: 'Location' },
  ];

  return (
    <div
      id="_JXzroy"
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-[45] border-b border-line-soft bg-white transition duration-250 ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex h-[67px] max-w-[1120px] items-center justify-between px-6">
        <nav aria-label="Listing sections" className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="font-medium hover:underline">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden text-sm md:block">
            <span className="font-semibold">
              {formatINR(booking.totalForNights, booking.currencySymbol)} for {booking.nights} nights
            </span>
            <span className="mx-2 text-muted2">·</span>
            <span>
              {rating} · {reviewCount} reviews
            </span>
          </div>
          <button type="button" className="reserve-gradient h-10 rounded-full px-6 text-sm font-medium text-white">
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
