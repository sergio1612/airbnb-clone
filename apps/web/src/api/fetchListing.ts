import type { ListingResponse } from '@play/shared';

export async function fetchListing(): Promise<ListingResponse> {
  const res = await fetch('/api/listing');
  if (!res.ok) {
    throw new Error(`Failed to load listing (${res.status})`);
  }
  return res.json() as Promise<ListingResponse>;
}
