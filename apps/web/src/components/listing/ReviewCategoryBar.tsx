type Props = {
  label: string;
  score: number;
  max?: number;
};

export function ReviewCategoryBar({ label, score, max = 5 }: Props) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  return (
    <div className="grid grid-cols-[1fr_48px] items-center gap-3 text-sm">
      <div className="flex items-center gap-3">
        <span className="min-w-[7.5rem]">{label}</span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-ink" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className="text-right font-medium">{score.toFixed(1)}</span>
    </div>
  );
}
