const footerColumns = [
  {
    title: 'Support',
    links: ['Help Centre', 'AirCover', 'Anti-discrimination', 'Disability support'],
  },
  {
    title: 'Community',
    links: ['Airbnb.org', 'Combating discrimination', 'Supporting refugees', 'Celebrating diversity'],
  },
  {
    title: 'Hosting',
    links: ['Airbnb your home', 'AirCover for Hosts', 'Hosting resources', 'Community forum'],
  },
  {
    title: 'Airbnb',
    links: ['Newsroom', 'New features', 'Careers', 'Investors'],
  },
];

export function SiteFooter() {
  return (
    <footer id="siteFooter" className="border-t border-line bg-grey100">
      <div className="mx-auto max-w-[1120px] px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-sm font-semibold">{col.title}</h2>
              <ul className="space-y-3 text-sm text-muted2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-6 text-sm text-muted2">
          <span>© 2026 Airbnb, Inc.</span>
          <span aria-hidden="true">·</span>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <span aria-hidden="true">·</span>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <span aria-hidden="true">·</span>
          <a href="#" className="hover:underline">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}
