import type { BookingInfo } from '@play/shared';
import { formatINR } from '../../lib/format';

type Props = {
  booking: BookingInfo;
};

export function BookingCard({ booking }: Props) {
  const staySubtotal = booking.pricePerNight * booking.nights;

  return (
    <aside id="bookingSticky" className="sticky top-[100px] self-start">
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-line bg-white p-4">
        <span className="text-sm">{booking.promoText}</span>
        <button type="button" className="ml-auto shrink-0 rounded-lg bg-grey100 px-3.5 py-2 text-sm font-medium hover:bg-grey200">
          Claim
        </button>
      </div>

      <div className="rounded-xl border border-card-border p-6 shadow-card">
        <div className="mb-6">
          <span className="text-[22px] font-semibold leading-none">
            {formatINR(booking.pricePerNight, booking.currencySymbol)}
          </span>
          <span className="text-base text-ink"> night</span>
        </div>

        <div className="mb-6 overflow-hidden rounded-lg border border-[#b0b0b0]">
          <div className="grid grid-cols-2">
            <label className="border-b border-[#b0b0b0] p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wide">Check-in</div>
              <div className="text-sm">{booking.checkIn}</div>
            </label>
            <label className="border-b border-l border-[#b0b0b0] p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wide">Checkout</div>
              <div className="text-sm">{booking.checkOut}</div>
            </label>
            <label className="col-span-2 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wide">Guests</div>
              <div className="text-sm">
                {booking.guests} guest{booking.guests === 1 ? '' : 's'}
              </div>
            </label>
          </div>
        </div>

        <button
          id="reserveBtn"
          type="button"
          className="reserve-gradient mb-4 h-12 w-full rounded-full text-base font-medium text-white transition active:scale-[0.98]"
        >
          Reserve
        </button>

        <p className="mb-4 text-center text-sm text-muted2">You won&apos;t be charged yet</p>

        <div className="mb-4 space-y-3 border-b border-line pb-4 text-base">
          <div className="flex justify-between">
            <span className="underline">
              {formatINR(booking.pricePerNight, booking.currencySymbol)} x {booking.nights} nights
            </span>
            <span>{formatINR(staySubtotal, booking.currencySymbol)}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Cleaning fee</span>
            <span>{formatINR(booking.cleaningFee, booking.currencySymbol)}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Airbnb service fee</span>
            <span>{formatINR(booking.serviceFee, booking.currencySymbol)}</span>
          </div>
        </div>

        <div className="mb-4 flex justify-between text-base font-semibold">
          <span>Total before taxes</span>
          <span>{formatINR(booking.totalForNights, booking.currencySymbol)}</span>
        </div>

        <p className="mb-4 text-center text-[13px] text-muted2">
          Free cancellation before {booking.freeCancellationBefore}
        </p>
        <button type="button" className="w-full text-center text-sm underline">
          Report this listing
        </button>
      </div>
    </aside>
  );
}
