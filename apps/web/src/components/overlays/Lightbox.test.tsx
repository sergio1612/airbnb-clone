import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Listing } from '@play/shared';
import { Lightbox } from './Lightbox';

const listing = {
  id: 'test',
  title: 'Test listing',
  photos: [
    { id: 1000, url: 'https://example.com/a.jpg', alt: 'A', categoryId: 'living-1' },
    { id: 1001, url: 'https://example.com/b.jpg', alt: 'B', categoryId: 'living-1' },
  ],
  categories: [
    { id: 'living-1', name: 'Living room 1', highlights: ['Sofa'], photoIds: [1000, 1001] },
  ],
} as unknown as Listing;

describe('Lightbox keyboard', () => {
  it('does not close on Escape (handled in App to avoid duplicate history entries)', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Lightbox
        listing={listing}
        photoId={1000}
        onClose={onClose}
        onBackToTour={onClose}
        onNavigate={vi.fn()}
      />,
    );

    await user.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
  });

  it('navigates with arrow keys', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    render(
      <Lightbox
        listing={listing}
        photoId={1000}
        onClose={vi.fn()}
        onBackToTour={vi.fn()}
        onNavigate={onNavigate}
      />,
    );

    await user.keyboard('{ArrowRight}');

    expect(onNavigate).toHaveBeenCalledWith(1001);
  });
});
