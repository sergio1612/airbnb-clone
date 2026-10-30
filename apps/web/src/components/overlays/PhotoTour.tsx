import type { Listing, ListingPhoto } from '@play/shared';
import { ChevronLeft, Heart, Share2 } from 'lucide-react';
import { useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { photoById } from '../../lib/format';

type Props = {
  listing: Listing;
  onBack: () => void;
  onOpenLightbox: (photoId: number) => void;
};

function TourPhotoButton({
  photo,
  title,
  index,
  onOpenLightbox,
}: {
  photo: ListingPhoto;
  title: string;
  index: number;
  onOpenLightbox: (photoId: number) => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${title} image ${index + 1}`}
      onClick={() => onOpenLightbox(photo.id)}
      className="photo-dim relative aspect-[3/2] overflow-hidden rounded-lg border-0 bg-grey200 p-0"
    >
      <img src={photo.url} alt={photo.alt} className="h-full w-full object-cover transition hover:scale-[1.04]" />
    </button>
  );
}

export function PhotoTour({ listing, onBack, onOpenLightbox }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true);

  return (
    <div
      ref={dialogRef}
      id="_KpcKWX"
      role="dialog"
      aria-modal="true"
      aria-label="Photo tour"
      aria-hidden="false"
      className="overlay-enter fixed inset-0 z-[120] flex flex-col bg-white"
    >
      <header id="tourBar" className="z-[5] flex h-[88px] shrink-0 items-center bg-white px-8">
        <button
          id="tourBack"
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-grey200"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-medium">Photo tour</div>
        <div className="ml-auto flex gap-0.5">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium underline hover:bg-grey100">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium underline hover:bg-grey100">
            <Heart className="h-4 w-4" />
            Save
          </button>
        </div>
      </header>

      <div id="tourScroll" className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1024px] px-6 pb-24">
          <nav id="tourNav" aria-label="Photo categories" className="mb-10 grid grid-cols-8 gap-3">
            {listing.categories.map((category) => {
              const thumb = photoById(listing.photos, category.photoIds[0]);
              if (!thumb) return null;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-label={category.name}
                  onClick={() => {
                    document.getElementById(`tour-room-${category.id}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col gap-2 border-0 bg-transparent p-0 text-left"
                >
                  <img src={thumb.url} alt="" className="aspect-square rounded-lg object-cover transition hover:scale-[1.04] hover:brightness-[0.94]" />
                  <span className="text-[13px] font-medium">{category.name}</span>
                </button>
              );
            })}
          </nav>

          <div id="tourRooms" className="space-y-10">
            {listing.categories.map((category) => {
              const photos = category.photoIds
                .map((id) => photoById(listing.photos, id))
                .filter(Boolean) as ListingPhoto[];
              const [hero, ...rest] = photos;
              if (!hero) return null;

              return (
                <section
                  key={category.id}
                  id={`tour-room-${category.id}`}
                  className="grid scroll-mt-24 grid-cols-1 items-start gap-x-[60px] gap-y-5 py-4 lg:grid-cols-2"
                >
                  <div className="sticky top-5 self-start">
                    <h2 className="text-[32px] font-medium leading-[1.1] tracking-[-0.02em]">{category.name}</h2>
                    {category.highlights.length > 0 && (
                      <p className="mt-2 text-base leading-snug text-muted2">
                        {category.highlights.join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <TourPhotoButton photo={hero} title={listing.title} index={0} onOpenLightbox={onOpenLightbox} />
                    {rest.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {rest.map((photo, index) => (
                          <TourPhotoButton
                            key={photo.id}
                            photo={photo}
                            title={listing.title}
                            index={index + 1}
                            onOpenLightbox={onOpenLightbox}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
