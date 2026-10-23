import { type SiteContent } from '@/lib/content';

export interface FooterProps {
  site: SiteContent;
}

const Footer = ({ site }: FooterProps) => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-start md:justify-between">
      <div className="space-y-3">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-cream">
          {site.name}
        </p>
        <p className="text-sm leading-relaxed text-muted">
          {site.tagline}
        </p>
      </div>

      <div className="space-y-2 md:text-right">
        <a
          href={`mailto:${site.email}`}
          className="block text-sm text-cream transition-colors hover:text-accent"
        >
          {site.email}
        </a>
        <ul className="flex gap-5 pt-2 md:justify-end">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="border-t border-line pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-center text-xs tracking-wide text-muted">
      © {new Date().getFullYear()} {site.name}. All rights reserved.
    </div>
  </footer>
);

export { Footer };
