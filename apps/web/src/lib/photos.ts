import type { Listing, ListingPhoto } from '@play/shared';

export function sortPhotos(photos: ListingPhoto[]) {
  return [...photos].sort((a, b) => a.id - b.id);
}

export function categoryForPhoto(listing: Listing, photoId: number) {
  return listing.categories.find((c) => c.photoIds.includes(photoId));
}

export function photoIndex(listing: Listing, photoId: number) {
  const ordered = sortPhotos(listing.photos);
  return ordered.findIndex((p) => p.id === photoId);
}
