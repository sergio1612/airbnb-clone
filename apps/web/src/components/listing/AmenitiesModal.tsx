import type { Amenity } from '@play/shared';
import { X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { AmenityIcon } from './AmenityIcon';

type Props = {
  amenities: Amenity[];
  open: boolean;
  onClose: () => void;
};

export function AmenitiesModal({ amenities, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  const grouped = useMemo(() => {
    const map = new Map<string, Amenity[]>();
    for (const item of amenities) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map.entries());
  }, [amenities]);

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
        aria-label="Close amenities"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="amenModalTitle"
        className="overlay-enter relative flex max-h-[min(720px,90vh)] w-full max-w-[780px] flex-col rounded-xl bg-white shadow-card"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-5">
          <h2 id="amenModalTitle" className="text-base font-semibold">
            What this place offers
          </h2>
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
          {grouped.map(([category, items]) => (
            <div key={category} className="mb-8 last:mb-0">
              <h3 className="mb-4 text-base font-semibold">{category}</h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                {items.map((amenity) => (
                  <li key={amenity.id} className="flex items-center gap-4 text-base">
                    <AmenityIcon name={amenity.icon} />
                    {amenity.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
