import cors from 'cors';
import express from 'express';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ListingResponse } from '@play/shared';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Resolved once at module load; path works for local `dist/` and Vercel when `fixtures/` is included. */
export function loadListing(): ListingResponse {
  const candidates = [
    join(__dirname, '../../../fixtures/listing.json'),
    join(process.cwd(), 'fixtures/listing.json'),
  ];

  for (const path of candidates) {
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as ListingResponse;
    } catch {
      // try next candidate
    }
  }

  throw new Error('Unable to load fixtures/listing.json');
}

const listingPayload = loadListing();

export function createApp() {
  const app = express();

  app.use(cors());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/listing', (_req, res) => {
    res.json(listingPayload);
  });

  return app;
}
