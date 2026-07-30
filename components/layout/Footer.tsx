import Link from 'next/link';
import { navLinks, site } from '@/lib/content';

const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
      <div className="space-y-3">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-cream">
          {site.name} <span className="text-accent">Film</span>
        </p>
        <p className="text-sm leading-relaxed text-muted">
          {site.tagline} — {site.location}
        </p>
      </div>

      <nav aria-label="Footer navigation">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-display text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-cream"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-2">
        <a
          href={`mailto:${site.email}`}
          className="block text-sm text-cream transition-colors hover:text-accent"
        >
          {site.email}
        </a>
        <ul className="flex gap-5 pt-2">
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
    <div className="border-t border-line py-5 text-center text-xs tracking-wide text-muted">
      © {new Date().getFullYear()} {site.name}. All rights reserved.
    </div>
  </footer>
);

export { Footer };
