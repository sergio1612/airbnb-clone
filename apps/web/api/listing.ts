import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ListingResponse } from '@play/shared';

/** Same path fallbacks as Express `loadListing()` for monorepo + Vercel layouts. */
function loadListing(): ListingResponse {
  const candidates = [
    join(process.cwd(), 'fixtures/listing.json'),
    join(process.cwd(), '../../fixtures/listing.json'),
    join(process.cwd(), '../../../fixtures/listing.json'),
  ];

  for (const path of candidates) {
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as ListingResponse;
    } catch {
      // try next
    }
  }

  throw new Error('Unable to load fixtures/listing.json');
}

type VercelHandler = (
  req: { method?: string },
  res: {
    status: (code: number) => { json: (body: unknown) => void; end: () => void };
    setHeader: (name: string, value: string) => void;
  },
) => void;

const listing = loadListing();

const handler: VercelHandler = (req, res) => {
  if (req.method && req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).json(listing);
};

export default handler;
