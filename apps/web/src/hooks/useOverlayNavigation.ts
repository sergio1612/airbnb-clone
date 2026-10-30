import { useCallback, useEffect, useState } from 'react';
import {
  buildOverlaySearch,
  parseOverlayFromSearch,
  type OverlayState,
} from '../lib/overlayState';

export function useOverlayNavigation() {
  const [overlay, setOverlay] = useState<OverlayState>(() =>
    parseOverlayFromSearch(window.location.search),
  );

  const commit = useCallback((next: OverlayState, mode: 'push' | 'replace' = 'push') => {
    setOverlay(next);
    const search = buildOverlaySearch(next);
    const url = `${window.location.pathname}${search}`;
    if (mode === 'replace') {
      window.history.replaceState({ overlay: next }, '', url);
    } else {
      window.history.pushState({ overlay: next }, '', url);
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      setOverlay(parseOverlayFromSearch(window.location.search));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openTour = useCallback(() => {
    commit({ mode: 'tour', photoId: null });
  }, [commit]);

  const openLightbox = useCallback(
    (photoId: number) => {
      commit({ mode: 'lightbox', photoId });
    },
    [commit],
  );

  const closeLightbox = useCallback(() => {
    commit({ mode: 'tour', photoId: null });
  }, [commit]);

  const closeAll = useCallback(() => {
    commit({ mode: 'none', photoId: null });
  }, [commit]);

  return {
    overlay,
    openTour,
    openLightbox,
    closeLightbox,
    closeAll,
  };
}
