import { Share2, Heart } from 'lucide-react';

type Props = {
  title: string;
};

export function TitleRow({ title }: Props) {
  return (
    <section className="flex items-start justify-between gap-4 pb-[18px] pt-8">
      <h1 className="max-w-[602px] text-[26px] font-medium leading-[30px] text-ink">{title}</h1>
      <div className="flex shrink-0 items-center gap-1">
        <button
          id="shareBtn"
          type="button"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium underline hover:bg-grey100"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button
          id="saveBtn"
          type="button"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium underline hover:bg-grey100"
        >
          <Heart className="h-4 w-4" />
          Save
        </button>
      </div>
    </section>
  );
}
