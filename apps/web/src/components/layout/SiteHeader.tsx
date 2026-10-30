import {
  Globe,
  Menu,
  Search,
  UserRound,
} from 'lucide-react';
import { AirbnbLogo } from './AirbnbLogo';

export function SiteHeader() {
  return (
    <header
      id="siteHeader"
      className="sticky top-0 z-40 border-b border-line-soft bg-white"
    >
      <div className="mx-auto flex h-[89px] max-w-[1760px] items-center gap-4 px-6 md:px-10">
        <a href="/" aria-label="Airbnb homepage" className="shrink-0">
          <AirbnbLogo />
        </a>

        <div className="mx-auto hidden h-[48px] max-w-[850px] flex-1 items-center rounded-full border border-line bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_4px_12px_rgb(0_0_0/0.05)] transition-shadow hover:shadow-[0_2px_4px_rgb(0_0_0/0.18)] md:flex">
          <button
            type="button"
            className="flex h-full flex-1 items-center border-r border-line px-6 text-left text-sm font-medium transition-colors hover:bg-grey100 rounded-l-full"
          >
            Anywhere
          </button>
          <button
            type="button"
            className="flex h-full flex-1 items-center border-r border-line px-6 text-left text-sm font-medium transition-colors hover:bg-grey100"
          >
            Any week
          </button>
          <button
            type="button"
            className="flex h-full flex-[1.2] items-center px-6 text-left text-sm text-muted2 transition-colors hover:bg-grey100"
          >
            Add guests
          </button>
          <button
            type="button"
            aria-label="Search"
            className="m-2 flex h-8 w-8 items-center justify-center rounded-full bg-rausch text-white"
          >
            <Search className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <a
            href="#"
            className="hidden rounded-full px-4 py-3 text-sm font-medium hover:bg-grey100 lg:inline-block"
          >
            Airbnb your home
          </a>
          <button
            type="button"
            aria-label="Choose a language and currency"
            className="rounded-full p-3 hover:bg-grey100"
          >
            <Globe className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Main navigation menu"
            className="flex items-center gap-2 rounded-full border border-line px-3 py-2 hover:shadow-hover"
          >
            <Menu className="h-4 w-4" />
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted2/30 text-muted">
              <UserRound className="h-5 w-5" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
