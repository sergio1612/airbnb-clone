import type { Review } from '@play/shared';
import { Star, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

type Props = {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  open: boolean;
  onClose: () => void;
};

export function ReviewsModal({ reviews, rating, reviewCount, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Close reviews"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reviewsModalTitle"
        className="overlay-enter relative flex max-h-[min(720px,90vh)] w-full max-w-[780px] flex-col rounded-xl bg-white shadow-card"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-ink stroke-ink" />
            <h2 id="reviewsModalTitle" className="text-base font-semibold">
              {rating} · {reviewCount} reviews
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-grey100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="grid gap-8 md:grid-cols-2">
            {reviews.map((review) => (
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
        </div>
      </div>
    </div>
  );
}
