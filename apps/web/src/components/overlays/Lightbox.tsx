import type { Listing } from '@play/shared';
import { ChevronLeft, ChevronRight, LayoutGrid, X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { categoryForPhoto, photoIndex, sortPhotos } from '../../lib/photos';

type Props = {
  listing: Listing;
  photoId: number;
  onClose: () => void;
  onBackToTour: () => void;
  onNavigate: (photoId: number) => void;
};

export function Lightbox({ listing, photoId, onClose, onBackToTour, onNavigate }: Props) {
  const ordered = useMemo(() => sortPhotos(listing.photos), [listing.photos]);
  const index = photoIndex(listing, photoId);
  const photo = ordered[index];
  const category = categoryForPhoto(listing, photoId);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Escape is handled centrally in App.tsx to avoid duplicate history updates.
        return;
      }
      if (event.key === 'ArrowRight' && index < ordered.length - 1) {
        event.preventDefault();
        onNavigate(ordered[index + 1].id);
      }
      if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        onNavigate(ordered[index - 1].id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, onClose, onNavigate, ordered]);

  if (!photo) return null;

  return (
    <div
      ref={dialogRef}
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-hidden="false"
      aria-label={`Photo ${index + 1} of ${ordered.length}`}
      className="lightbox-enter fixed inset-0 z-[140] flex items-center justify-center bg-white"
    >
      <div className="absolute inset-x-0 top-0 z-[3] flex h-[72px] items-center px-6">
        <button
          id="lbGrid"
          type="button"
          aria-label="Back to photo tour"
          onClick={onBackToTour}
          className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-grey200"
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
        <div id="lbTitle" className="absolute left-1/2 -translate-x-1/2 text-base font-medium">
          {category?.name ?? 'Photo'}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span id="lbCounter" className="text-sm">
            {index + 1} of {ordered.length}
          </span>
          <button
            id="lbClose"
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-grey200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <button
        id="lbPrev"
        type="button"
        aria-label="Previous"
        disabled={index <= 0}
        onClick={() => index > 0 && onNavigate(ordered[index - 1].id)}
        className="absolute left-5 top-1/2 z-[3] inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink bg-white hover:bg-grey100 disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div id="lbStage" className="flex h-full w-full items-center justify-center px-24 py-[88px]">
        <img
          src={photo.url}
          alt={photo.alt}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <button
        id="lbNext"
        type="button"
        aria-label="Next"
        disabled={index >= ordered.length - 1}
        onClick={() => index < ordered.length - 1 && onNavigate(ordered[index + 1].id)}
        className="absolute right-5 top-1/2 z-[3] inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink bg-white hover:bg-grey100 disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
