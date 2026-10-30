import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TOUR_MODAL } from '../lib/overlayState';
import { useOverlayNavigation } from './useOverlayNavigation';

describe('useOverlayNavigation history', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pushes one history entry when opening tour', () => {
    const pushState = vi.spyOn(window.history, 'pushState');
    const { result } = renderHook(() => useOverlayNavigation());

    act(() => {
      result.current.openTour();
    });

    expect(pushState).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe(`?modal=${TOUR_MODAL}`);
  });

  it('pushes one history entry when closing lightbox back to tour', () => {
    const { result } = renderHook(() => useOverlayNavigation());

    act(() => {
      result.current.openTour();
      result.current.openLightbox(1000);
    });

    const pushState = vi.spyOn(window.history, 'pushState');

    act(() => {
      result.current.closeLightbox();
    });

    expect(pushState).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe(`?modal=${TOUR_MODAL}`);
    expect(result.current.overlay.mode).toBe('tour');
  });

  it('syncs overlay state when popstate reflects tour URL after lightbox', () => {
    window.history.replaceState({}, '', `?modal=${TOUR_MODAL}&modalItem=1000`);
    const { result } = renderHook(() => useOverlayNavigation());

    expect(result.current.overlay.mode).toBe('lightbox');

    act(() => {
      window.history.replaceState({}, '', `?modal=${TOUR_MODAL}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current.overlay.mode).toBe('tour');
    expect(window.location.search).toBe(`?modal=${TOUR_MODAL}`);
  });

  it('syncs overlay state when popstate reflects lightbox URL after tour', () => {
    window.history.replaceState({}, '', `?modal=${TOUR_MODAL}`);
    const { result } = renderHook(() => useOverlayNavigation());

    expect(result.current.overlay.mode).toBe('tour');

    act(() => {
      window.history.replaceState({}, '', `?modal=${TOUR_MODAL}&modalItem=1001`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current.overlay.mode).toBe('lightbox');
    expect(result.current.overlay.photoId).toBe(1001);
  });
});
