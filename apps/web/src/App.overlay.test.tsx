import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { TOUR_MODAL } from './lib/overlayState';

const listingFixture = {
  listing: {
    id: 'test-listing',
    title: 'Test Listing Title',
    pageTitle: 'Test page title',
    propertyType: 'Entire apartment',
    location: 'Candolim',
    country: 'India',
    guests: 3,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    rating: 4.95,
    reviewCount: 19,
    isGuestFavourite: true,
    guestFavouriteBlurb: 'Guest favourite blurb',
    description: 'Description',
    sleepSummary: '1 bed',
    sleepSpaces: [{ id: 'bedroom', name: 'Bedroom', summary: '1 bed', photoId: 1000 }],
    highlights: [],
    host: {
      name: 'Host',
      avatar: 'https://example.com/host.jpg',
      yearsHosting: 2,
      isSuperhost: true,
      totalReviews: 100,
      responseRate: '100%',
      responseTime: '1 hour',
      bio: 'Bio',
    },
    booking: {
      currencySymbol: '₹',
      pricePerNight: 8429,
      cleaningFee: 1500,
      serviceFee: 4899,
      totalForNights: 48844,
      nights: 5,
      checkIn: '10/18/2026',
      checkOut: '10/23/2026',
      guests: 2,
      maxGuests: 3,
      freeCancellationBefore: '17 October',
      promoText: 'Promo',
    },
    amenities: [{ id: 'wifi', label: 'Wifi', icon: 'wifi', category: 'Internet' }],
    photos: [
      { id: 1000, url: 'https://example.com/1.jpg', alt: 'One', categoryId: 'living-1' },
      { id: 1001, url: 'https://example.com/2.jpg', alt: 'Two', categoryId: 'living-1' },
      { id: 1002, url: 'https://example.com/3.jpg', alt: 'Three', categoryId: 'living-1' },
      { id: 1003, url: 'https://example.com/4.jpg', alt: 'Four', categoryId: 'living-1' },
      { id: 1004, url: 'https://example.com/5.jpg', alt: 'Five', categoryId: 'living-1' },
    ],
    categories: [
      { id: 'living-1', name: 'Living room 1', highlights: ['Sofa'], photoIds: [1000, 1001] },
    ],
    heroPhotoIds: [1000, 1001, 1002, 1003, 1004],
    reviews: [],
    reviewCategories: [],
    houseRules: [],
    safetyItems: [],
    cancellationSummary: 'Cancel summary',
    checkInTime: '2pm',
    checkOutTime: '11am',
    locationBlurb: 'Location',
    mapEmbedQuery: 'Candolim',
    nearbyStays: [],
  },
};

vi.mock('./api/fetchListing', () => ({
  fetchListing: vi.fn(() => Promise.resolve(listingFixture)),
}));

describe('App overlay Escape history regression', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('records exactly one pushState when Escape closes lightbox once', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Listing Title' })).toBeInTheDocument();
    });

    const pushState = vi.spyOn(window.history, 'pushState');

    await act(async () => {
      screen.getByRole('button', { name: 'Show all photos' }).click();
    });
    await act(async () => {
      screen.getAllByRole('button', { name: /Test Listing Title image 1/i })[1]?.click();
    });

    expect(window.location.search).toContain(`modal=${TOUR_MODAL}`);
    expect(window.location.search).toContain('modalItem=1000');

    pushState.mockClear();

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    });

    expect(pushState).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe(`?modal=${TOUR_MODAL}`);
  });

  it('closes tour then listing with repeated Escape presses', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Listing Title' })).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByRole('button', { name: 'Show all photos' }).click();
    });
    await act(async () => {
      screen.getAllByRole('button', { name: /Test Listing Title image 1/i })[1]?.click();
    });

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    });
    expect(window.location.search).toBe(`?modal=${TOUR_MODAL}`);

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    });
    expect(window.location.search).toBe('');
  });
});
