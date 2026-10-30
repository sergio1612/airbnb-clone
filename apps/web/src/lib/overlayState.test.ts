import { describe, expect, it } from 'vitest';
import {
  buildOverlaySearch,
  parseOverlayFromSearch,
  reduceOverlay,
  TOUR_MODAL,
} from './overlayState';

describe('overlayState', () => {
  it('parses tour modal from search', () => {
    expect(parseOverlayFromSearch(`?modal=${TOUR_MODAL}`)).toEqual({
      mode: 'tour',
      photoId: null,
    });
  });

  it('parses lightbox modal item', () => {
    expect(parseOverlayFromSearch(`?modal=${TOUR_MODAL}&modalItem=1000`)).toEqual({
      mode: 'lightbox',
      photoId: 1000,
    });
  });

  it('builds search strings', () => {
    expect(buildOverlaySearch({ mode: 'lightbox', photoId: 1001 })).toBe(
      `?modal=${TOUR_MODAL}&modalItem=1001`,
    );
  });

  it('reduces close-lightbox to tour', () => {
    expect(
      reduceOverlay({ mode: 'lightbox', photoId: 1000 }, { type: 'close-lightbox' }),
    ).toEqual({ mode: 'tour', photoId: null });
  });
});
