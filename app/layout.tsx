import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Footer, Navbar } from '@/components/layout';
import { site } from '@/lib/content';
import { getSite } from '@/lib/data';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    'Andrew Davies is a Seattle-based filmmaker creating short films, social media campaigns, event and wedding videos, and commercial work.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await getSite();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col">
        <Navbar site={siteContent} />
        <main className="flex-1">{children}</main>
        <Footer site={siteContent} />
      </body>
    </html>
  );
}
