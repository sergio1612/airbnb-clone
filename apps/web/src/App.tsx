import { useEffect, useRef, useState } from 'react';
import type { Listing } from '@play/shared';
import { fetchListing } from './api/fetchListing';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { BookingCard } from './components/listing/BookingCard';
import { ListingContent } from './components/listing/ListingContent';
import { PhotoMosaic } from './components/listing/PhotoMosaic';
import { StickySectionNav } from './components/listing/StickySectionNav';
import { TitleRow } from './components/listing/TitleRow';
import { Lightbox } from './components/overlays/Lightbox';
import { PhotoTour } from './components/overlays/PhotoTour';
import { useOverlayNavigation } from './hooks/useOverlayNavigation';

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted2">Loading…</div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-[15px] leading-relaxed text-muted2">{message}</div>
  );
}

export default function App() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stickyNavVisible, setStickyNavVisible] = useState(false);
  const { overlay, openTour, openLightbox, closeLightbox, closeAll } = useOverlayNavigation();
  const pageChromeRef = useRef<HTMLDivElement>(null);
  const overlayOpen = overlay.mode !== 'none';

  useEffect(() => {
    document.title = listing?.pageTitle ?? 'Airbnb listing';
  }, [listing?.pageTitle]);

  useEffect(() => {
    fetchListing()
      .then((data) => setListing(data.listing))
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const photos = document.getElementById('photos');
      if (!photos) return;
      setStickyNavVisible(photos.getBoundingClientRect().bottom < 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [listing]);

  useEffect(() => {
    if (overlay.mode === 'none') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      if (overlay.mode === 'lightbox') {
        closeLightbox();
      } else {
        closeAll();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlay.mode, closeAll, closeLightbox]);

  useEffect(() => {
    document.body.style.overflow = overlay.mode === 'none' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [overlay.mode]);

  if (error) return <ErrorState message={error} />;
  if (!listing) return <LoadingState />;

  const showTour = overlay.mode === 'tour' || overlay.mode === 'lightbox';
  const showLightbox = overlay.mode === 'lightbox' && overlay.photoId != null;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div ref={pageChromeRef} {...(overlayOpen ? { inert: true } : {})}>
        <SiteHeader />
        <StickySectionNav
          visible={stickyNavVisible && overlay.mode === 'none'}
          booking={listing.booking}
          rating={listing.rating}
          reviewCount={listing.reviewCount}
        />

        <main id="main" className="mx-auto max-w-[1120px] pb-20 pt-0">
          <TitleRow title={listing.title} />
          <PhotoMosaic
            heroPhotoIds={listing.heroPhotoIds}
            photos={listing.photos}
            title={listing.title}
            onOpenTour={openTour}
          />
          <div className="grid items-start gap-x-24 lg:grid-cols-[minmax(0,1fr)_372px]">
            <ListingContent listing={listing} />
            <BookingCard booking={listing.booking} />
          </div>
        </main>
        <SiteFooter />
      </div>

      {showTour && (
        <PhotoTour
          listing={listing}
          onBack={closeAll}
          onOpenLightbox={openLightbox}
        />
      )}

      {showLightbox && overlay.photoId != null && (
        <Lightbox
          listing={listing}
          photoId={overlay.photoId}
          onClose={closeLightbox}
          onBackToTour={closeLightbox}
          onNavigate={openLightbox}
        />
      )}
    </>
  );
}
