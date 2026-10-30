import type { BookingInfo } from '@play/shared';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function parseUsDate(value: string): Date {
  const [month, day, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function inRange(day: Date, start: Date, end: Date) {
  const t = day.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

function buildMonthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function MonthGrid({
  year,
  month,
  checkIn,
  checkOut,
}: {
  year: number;
  month: number;
  checkIn: Date;
  checkOut: Date;
}) {
  const label = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const cells = buildMonthCells(year, month);

  return (
    <div>
      <div className="mb-4 text-center text-base font-semibold">{label}</div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted2">
        {WEEKDAYS.map((d, i) => (
          <div key={`${d}-${i}`} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {cells.map((day, index) => {
          if (day == null) return <div key={`empty-${index}`} aria-hidden="true" />;
          const date = new Date(year, month, day);
          const selected = inRange(date, checkIn, checkOut);
          const isStart = sameDay(date, checkIn);
          const isEnd = sameDay(date, checkOut);
          return (
            <div
              key={`${year}-${month}-${day}`}
              className={`relative flex h-10 items-center justify-center ${
                selected ? 'bg-grey200' : ''
              } ${isStart ? 'rounded-l-full' : ''} ${isEnd ? 'rounded-r-full' : ''}`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isStart || isEnd ? 'bg-ink text-white' : selected ? 'font-medium' : 'text-muted2'
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Props = {
  booking: BookingInfo;
};

export function AvailabilityCalendar({ booking }: Props) {
  const checkIn = parseUsDate(booking.checkIn);
  const checkOut = parseUsDate(booking.checkOut);
  const monthA = checkIn.getMonth();
  const yearA = checkIn.getFullYear();
  const monthB = monthA === 11 ? 0 : monthA + 1;
  const yearB = monthA === 11 ? yearA + 1 : yearA;

  return (
    <section id="availability" className="border-b border-line py-8">
      <h2 className="mb-2 text-[22px] font-semibold">
        {booking.nights} nights in Candolim
      </h2>
      <p className="mb-6 text-sm text-muted2">
        {checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        {' – '}
        {checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
      <div className="grid gap-10 md:grid-cols-2">
        <MonthGrid year={yearA} month={monthA} checkIn={checkIn} checkOut={checkOut} />
        <MonthGrid year={yearB} month={monthB} checkIn={checkIn} checkOut={checkOut} />
      </div>
      <button type="button" className="mt-6 font-medium underline">
        Clear dates
      </button>
    </section>
  );
}
