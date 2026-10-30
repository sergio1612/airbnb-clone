export type OverlayMode = 'none' | 'tour' | 'lightbox';

export type OverlayState = {
  mode: OverlayMode;
  photoId: number | null;
};

export const TOUR_MODAL = 'PHOTO_TOUR_SCROLLABLE';

export function parseOverlayFromSearch(search: string): OverlayState {
  const params = new URLSearchParams(search);
  const modal = params.get('modal');
  const modalItem = params.get('modalItem');

  if (modal !== TOUR_MODAL) {
    return { mode: 'none', photoId: null };
  }

  if (modalItem) {
    const photoId = Number(modalItem);
    if (Number.isFinite(photoId)) {
      return { mode: 'lightbox', photoId };
    }
  }

  return { mode: 'tour', photoId: null };
}

export function buildOverlaySearch(state: OverlayState): string {
  if (state.mode === 'none') return '';
  const params = new URLSearchParams();
  params.set('modal', TOUR_MODAL);
  if (state.mode === 'lightbox' && state.photoId != null) {
    params.set('modalItem', String(state.photoId));
  }
  return `?${params.toString()}`;
}

export function reduceOverlay(
  current: OverlayState,
  action:
    | { type: 'open-tour' }
    | { type: 'open-lightbox'; photoId: number }
    | { type: 'close-lightbox' }
    | { type: 'close-all' }
    | { type: 'sync'; state: OverlayState },
): OverlayState {
  switch (action.type) {
    case 'open-tour':
      return { mode: 'tour', photoId: null };
    case 'open-lightbox':
      return { mode: 'lightbox', photoId: action.photoId };
    case 'close-lightbox':
      return current.mode === 'lightbox' ? { mode: 'tour', photoId: null } : current;
    case 'close-all':
      return { mode: 'none', photoId: null };
    case 'sync':
      return action.state;
    default:
      return current;
  }
}
