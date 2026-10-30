import type { ListingPhoto } from '@play/shared';
import { LayoutGrid } from 'lucide-react';
import { photoById } from '../../lib/format';

type Props = {
  heroPhotoIds: number[];
  photos: ListingPhoto[];
  title: string;
  onOpenTour: () => void;
};

export function PhotoMosaic({ heroPhotoIds, photos, title, onOpenTour }: Props) {
  const cells = heroPhotoIds.slice(0, 5).map((id) => photoById(photos, id)).filter(Boolean) as ListingPhoto[];

  return (
    <section
      id="photos"
      aria-label="Photos of this place"
      className="relative mb-12"
    >
      <div
        id="heroGrid"
        className="grid aspect-[1120/494] grid-cols-[35fr_17fr_17fr] grid-rows-2 gap-2 overflow-hidden rounded-xl"
      >
        {cells.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            aria-label={`${title} image ${index + 1}`}
            onClick={() => onOpenTour()}
            className={`photo-dim relative block overflow-hidden border-0 bg-grey200 p-0 ${
              index === 0 ? 'row-span-2' : ''
            }`}
          >
            <img
              src={photo.url}
              alt={photo.alt}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </button>
        ))}
      </div>

      <button
        id="showAllPhotos"
        type="button"
        onClick={onOpenTour}
        className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-lg border border-ink bg-white px-[15px] py-[7px] text-xs font-medium leading-4 shadow-[0_2px_8px_rgb(0_0_0/0.15)] transition hover:bg-grey100"
      >
        <LayoutGrid className="h-[15px] w-[15px]" />
        Show all photos
      </button>
    </section>
  );
}
