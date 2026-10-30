import type { Host } from '@play/shared';
import { Star } from 'lucide-react';

type Props = {
  host: Host;
  listingRating: number;
  listingReviewCount: number;
};

export function HostProfileCard({ host, listingRating, listingReviewCount }: Props) {
  return (
    <div className="rounded-xl border border-line p-6 shadow-[0_6px_16px_rgb(0_0_0/0.08)]">
      <div className="flex flex-wrap items-start gap-6">
        <div className="relative shrink-0">
          <img
            src={host.avatar}
            alt=""
            className="h-24 w-24 rounded-full object-cover"
          />
          {host.isSuperhost && (
            <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded bg-white px-2 py-0.5 text-[11px] font-semibold shadow-sm ring-1 ring-line">
              <Star className="h-3 w-3 fill-ink stroke-ink" />
              Superhost
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[22px] font-semibold">Host — {host.name}</h3>
          <div className="mt-4 grid grid-cols-3 gap-4 border-y border-line py-4 text-center">
            <div>
              <div className="text-lg font-semibold">{host.totalReviews.toLocaleString()}</div>
              <div className="text-sm text-muted2">Reviews</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                {listingRating}
                <Star className="h-3.5 w-3.5 fill-ink stroke-ink" />
              </div>
              <div className="text-sm text-muted2">Rating</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{host.yearsHosting}</div>
              <div className="text-sm text-muted2">Years hosting</div>
            </div>
          </div>
          <p className="mt-4 text-base leading-7">{host.bio}</p>
          <p className="mt-3 text-sm text-muted2">
            Response rate: {host.responseRate} · {host.responseTime}
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg border border-ink px-5 py-3 text-sm font-medium hover:bg-grey100"
          >
            Message host
          </button>
          <p className="mt-4 text-xs text-muted2">
            To help protect your payment, always use Airbnb to send money and communicate with hosts.
          </p>
        </div>
      </div>
      <p className="sr-only">{listingReviewCount} reviews for this listing</p>
    </div>
  );
}
