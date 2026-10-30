import type { Listing } from '@play/shared';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { photoById } from '../../lib/format';
import { AmenitiesModal } from './AmenitiesModal';
import { AmenityIcon } from './AmenityIcon';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { HostProfileCard } from './HostProfileCard';
import { ListingHighlights } from './ListingHighlights';
import { NearbyStays } from './NearbyStays';
import { ReviewCategoryBar } from './ReviewCategoryBar';
import { ReviewsModal } from './ReviewsModal';

type Props = {
  listing: Listing;
};

function LaurelIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2C8 8 4 14 4 22c0 6 3.5 10 8 12M12 2c4 6 8 12 8 20 0 6-3.5 10-8 12"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 18c-2 2-3 5-3 8M16 18c2 2 3 5 3 8M10 26c-1 1-1.5 3-1.5 5M14 26c1 1 1.5 3 1.5 5"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function ListingContent({ listing }: Props) {
  const previewAmenities = listing.amenities.slice(0, 10);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const descriptionPreview = listing.description.slice(0, 220);
  const showDescriptionToggle = listing.description.length > descriptionPreview.length;

  return (
    <div id="contentLeft" className="min-w-0">
      <section className="border-b border-line pb-6">
        <h2 className="text-[22px] font-semibold">
          {listing.propertyType} in {listing.location}, {listing.country}
        </h2>
        <p className="mt-1 text-base text-muted2">
          {listing.guests} guests · {listing.bedrooms} bedroom · {listing.beds} bed · {listing.baths}{' '}
          bathroom
        </p>
      </section>

      {listing.isGuestFavourite && (
        <section className="mb-6 rounded-xl border border-line px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <LaurelIcon className="h-11 w-5 text-ink" />
              <div className="text-center text-sm font-semibold leading-tight">
                Guest
                <br />
                favourite
              </div>
              <LaurelIcon className="h-11 w-5 scale-x-[-1] text-ink" />
              <p className="max-w-sm text-sm">{listing.guestFavouriteBlurb}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{listing.rating}</div>
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-ink stroke-ink" />
                  ))}
                </div>
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <div className="text-lg font-semibold">{listing.reviewCount}</div>
                <div className="text-xs underline">Reviews</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="flex items-center gap-4 border-b border-line py-6">
        <div className="relative shrink-0">
          <img
            src={listing.host.avatar}
            alt=""
            className="h-14 w-14 rounded-full object-cover"
          />
        </div>
        <div>
          <div className="font-medium">Hosted by {listing.host.name}</div>
          <div className="text-sm text-muted2">
            {listing.host.yearsHosting} years hosting
            {listing.host.isSuperhost ? ' · Superhost' : ''}
          </div>
        </div>
      </section>

      {listing.highlights?.length > 0 && <ListingHighlights highlights={listing.highlights} />}

      <section className="border-b border-line py-6">
        <p className="whitespace-pre-wrap text-base leading-7">
          {descriptionExpanded || !showDescriptionToggle
            ? listing.description
            : `${descriptionPreview}…`}
        </p>
        {showDescriptionToggle && (
          <button
            type="button"
            onClick={() => setDescriptionExpanded((v) => !v)}
            className="mt-2 font-medium underline"
          >
            {descriptionExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </section>

      <section className="flex items-center justify-between border-b border-line py-4 text-sm">
        <span className="text-muted2">Some info has been automatically translated.</span>
        <button type="button" className="font-medium underline">
          Show original
        </button>
      </section>

      <section id="sleep" className="border-b border-line py-8">
        <h2 className="mb-4 text-[22px] font-semibold">Where you&apos;ll sleep</h2>
        <div className="flex flex-wrap gap-4">
          {(listing.sleepSpaces ?? []).map((space) => {
            const photo = photoById(listing.photos, space.photoId);
            return (
              <div key={space.id} className="w-[200px] rounded-xl border border-line p-4">
                {photo && (
                  <img
                    src={photo.url}
                    alt=""
                    className="mb-3 aspect-[4/3] w-full rounded-lg object-cover"
                  />
                )}
                <div className="font-medium">{space.name}</div>
                <div className="text-sm text-muted2">{space.summary}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="amenities" className="border-b border-line py-8">
        <h2 className="mb-6 text-[22px] font-semibold">What this place offers</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {previewAmenities.map((amenity) => (
            <li key={amenity.id} className="flex items-center gap-4 text-base">
              <AmenityIcon name={amenity.icon} />
              {amenity.label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setAmenitiesOpen(true)}
          className="mt-6 rounded-lg border border-ink px-5 py-3 text-sm font-medium transition hover:bg-grey100"
        >
          Show all {listing.amenities.length} amenities
        </button>
      </section>

      <AvailabilityCalendar booking={listing.booking} />

      <section id="reviews" className="border-b border-line py-8">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
          <LaurelIcon className="hidden h-14 w-7 text-ink sm:block" />
          <div className="text-center sm:text-left">
            <div className="text-[48px] font-semibold leading-none">{listing.rating}</div>
            <div className="mt-1 text-sm font-medium">Guest favourite</div>
          </div>
          <LaurelIcon className="hidden h-14 w-7 scale-x-[-1] text-ink sm:block" />
        </div>
        <div className="mb-10 grid max-w-xl gap-3">
          {listing.reviewCategories.map((item) => (
            <ReviewCategoryBar key={item.label} label={item.label} score={item.score} />
          ))}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {listing.reviews.map((review) => (
            <article key={review.id}>
              <div className="mb-3 flex items-center gap-3">
                <img src={review.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="font-medium">{review.author}</div>
                  <div className="text-sm text-muted2">{review.date}</div>
                </div>
              </div>
              <p className="text-base leading-7">{review.text}</p>
            </article>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setReviewsOpen(true)}
          className="mt-8 rounded-lg border border-ink px-5 py-3 text-sm font-medium transition hover:bg-grey100"
        >
          Show all {listing.reviewCount} reviews
        </button>
      </section>

      <section id="location" className="border-b border-line py-8">
        <h2 className="mb-2 text-[22px] font-semibold">Where you&apos;ll be</h2>
        <p className="mb-4 text-base">{listing.locationBlurb}</p>
        <div className="overflow-hidden rounded-xl border border-line">
          <iframe
            title="Map"
            className="h-[480px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.mapEmbedQuery)}&z=13&output=embed`}
          />
        </div>
      </section>

      <section className="border-b border-line py-8">
        <h2 className="mb-6 text-[22px] font-semibold">Meet your host</h2>
        <HostProfileCard
          host={listing.host}
          listingRating={listing.rating}
          listingReviewCount={listing.reviewCount}
        />
      </section>

      <section className="border-b border-line py-8">
        <h2 className="mb-6 text-[22px] font-semibold">Things to know</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-medium">Cancellation policy</h3>
            <p className="text-sm leading-6 text-muted2">{listing.cancellationSummary}</p>
          </div>
          <div>
            <h3 className="mb-3 font-medium">House rules</h3>
            <ul className="space-y-2 text-sm text-muted2">
              {listing.houseRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-medium">Safety &amp; property</h3>
            <ul className="space-y-2 text-sm text-muted2">
              {listing.safetyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <NearbyStays stays={listing.nearbyStays ?? []} />

      <AmenitiesModal
        amenities={listing.amenities}
        open={amenitiesOpen}
        onClose={() => setAmenitiesOpen(false)}
      />
      <ReviewsModal
        reviews={listing.reviews}
        rating={listing.rating}
        reviewCount={listing.reviewCount}
        open={reviewsOpen}
        onClose={() => setReviewsOpen(false)}
      />
    </div>
  );
}
