import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp, loadListing } from './app.js';

describe('createApp', () => {
  it('loads bundled listing fixture', () => {
    const payload = loadListing();
    expect(payload.listing.id).toBe('candolim-jacuzzi-1bhk');
    expect(payload.listing.photos.length).toBeGreaterThan(0);
  });

  it('GET /api/listing returns listing JSON', async () => {
    const app = createApp();
    const response = await request(app).get('/api/listing');

    expect(response.status).toBe(200);
    expect(response.body.listing.title).toContain('Candolim');
  });

  it('GET /api/health returns ok', async () => {
    const app = createApp();
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});
